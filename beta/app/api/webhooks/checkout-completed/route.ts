import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createReport, redeemReport } from '@/lib/database';

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
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Webhook Error: ${err.message}`);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    } else {
      console.error('Webhook Error: An unknown error occurred.');
      return new NextResponse('Webhook Error: An unknown error occurred.', { status: 400 });
    }
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':  
      const checkoutSession = event.data.object;
      console.log("Webhook checkout session:", checkoutSession);
          
      // Generate report ID
      const quantity = parseInt(checkoutSession.metadata.quantity);
      const details = checkoutSession.metadata.details;

      if (isNaN(quantity) || quantity <= 0) {
        console.error('Invalid quantity in metadata.');
        return new NextResponse('Invalid quantity in metadata.', { status: 400 });
      }
          
      const reportIds: string[] = [];
      for (let i = 0; i < quantity; i++) {
        const createReportResponse = await createReport(checkoutSession.id);
        if (!createReportResponse.success) {
          console.error(`Error creating report for checkout session ${checkoutSession.id}`);
          return new NextResponse(
            `Error creating report for checkout session ${checkoutSession.id}`,
            { status: 500 }
          );
        }
        reportIds.push(createReportResponse.reportId);
      }

      // Redeem report if details were provided
      // When the redeem report function is fully specified, this will
      // need to be not awaited since it would take too much time
      // before sending a response back to stripe.
      if (details) {
        const firstReportId = reportIds[0];
        const redeemResponse = await redeemReport(firstReportId, details);

        if (!redeemResponse.success) {
          console.error('Error redeeming report.');
          return new NextResponse('Error redeeming report.', { status: 500 });
        }
      }
          
      break;
          
    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Success', { status: 200 });
}

