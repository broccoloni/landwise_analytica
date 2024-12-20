import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { quantity } = body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `${quantity === 1 ? 'Single' : 'Three'} Landwise Report(s)`,
            },
            unit_amount: quantity === 1 ? 129995 : 299995, // In cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-complete?session_id={CHECKOUT_SESSION_ID}&quantity=${quantity}`,
      cancel_url: `${req.headers.get('origin')}/get-a-report`,

      // invoice_creation: {
      //   enabled: true,
      // },
      // automatic_tax: {
      //   enabled: true,
      // },
      // return_url: `${req.headers.get('origin')}/payment?session_id={CHECKOUT_SESSION_ID}`,
      // ui_mode: 'embedded',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
