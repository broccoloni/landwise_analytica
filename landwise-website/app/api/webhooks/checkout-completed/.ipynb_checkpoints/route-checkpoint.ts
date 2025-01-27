import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createReport, updateUser } from '@/lib/database';
import { sendEmail } from '@/utils/sendEmail';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') || '';
  let event;

  if (!endpointSecret) {
    console.error('Webhook secret is not defined in environment variables.');
    return new NextResponse('Webhook secret is not defined.', { status: 500 });
  }

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Webhook Error: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    } else {
      console.error('Webhook Error: An unknown error occurred');
      return new NextResponse('Webhook Error: An unknown error occurred', { status: 400 });
    }
  }


  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      console.log('Webhook checkout session completed:', checkoutSession);

      if (!checkoutSession.metadata) {
        console.error('Metadata is missing in checkout session.');
        return new NextResponse('Metadata is missing in checkout session.', { status: 400 });
      }
          
      const quantity = parseInt(checkoutSession.metadata.quantity);
      const size = checkoutSession.metadata.size;
      const customerId = checkoutSession.metadata.customerId || null;
      const customerEmail =
        checkoutSession.customer_email || checkoutSession.customer_details?.email;

      if (isNaN(quantity) || quantity <= 0 || !size) {
        console.error('Invalid quantity or size in metadata.');
        return new NextResponse('Invalid quantity or size in metadata.', { status: 400 });
      }

      const reportIds: string[] = [];
      for (let i = 0; i < quantity; i++) {
        const createReportResponse = await createReport(checkoutSession.id, customerId, size);
    
        if (!createReportResponse.success) {
          console.error(`Error creating report for checkout session ${checkoutSession.id}`);
          return new NextResponse(
            `Error creating report for checkout session ${checkoutSession.id}`,
            { status: 500 }
          );
        }
    
        // Ensure that reportId is a string before pushing
        if (createReportResponse.reportId) {
          reportIds.push(createReportResponse.reportId);
        } else {
          console.error(`Missing reportId for checkout session ${checkoutSession.id}`);
          return new NextResponse('Missing reportId.', { status: 500 });
        }
      }

      const reportLink = customerId ? `${process.env.NEXTAUTH_URL}/view-report/` : `${process.env.NEXTAUTH_URL}/redeem-a-report?reportId=`;
      const subject = 'Your Report IDs';
      const text = `Thank you for your purchase! Your report IDs are: ${reportIds.join(', ')}. You can use these IDs to redeem your reports.`;

      const html = `
        <div style="background-color: #FAF8F0; padding: 10px;">
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #FFFFFF;">
            <h1 style="color: #4CAF50; text-align: center;">Thank You for Your Purchase!</h1>
            <p>Below are your report IDs:</p>
            <div style="margin: 20px 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
              ${reportIds
                .map(
                  (reportId) => `
                  <div style="margin: 10px;">
                    <strong>Report ID:</strong> ${reportId} - 
                    <a 
                      href="${reportLink}${reportId}" 
                      style="color: #4CAF50; text-decoration: none; font-weight: bold;" 
                      target="_blank"
                    >
                      ${customerId ? 'View Now' : 'Redeem Now'}
                    </a>
                  </div>
                `
                )
                .join('')}
            </div>
            <p>
              ${customerId ? 
                'Your report is being processed and should be ready to view shortly. Feel free to reach out to us if you have any questions.' :
                'You can use these IDs to redeem your reports at any time. If you have any questions, feel free to reach out to us.'
              }
            </p>
            <div style="margin-top: 30px;">
              <p>Best regards,</p>
              <p>The <strong>Landwise Analytica</strong> Team</p>
            </div>
            <div style="margin-top: 20px; font-size: 0.9em; color: #777; text-align: center;">
              <p>If you did not make this purchase, please ignore this email or 
              <a 
                href="mailto:${process.env.EMAIL_USER}?subject=Question about redeeming report&body=" 
                style="color: #4CAF50; text-decoration: none;"
              >
                contact us
              </a>.</p>
            </div>
          </div>
        </div>
      `;

      if (customerEmail) {
        const emailResult = await sendEmail({
          to: customerEmail,
          subject,
          text,
          html,
        });

        if (!emailResult.success) {
          console.error('Failed to send email:', emailResult.error);
          return new NextResponse('Failed to send email.', { status: 500 });
        }
      }
      break;

    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Success', { status: 200 });
}
