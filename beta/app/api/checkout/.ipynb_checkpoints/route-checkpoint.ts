import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // Note: Details is too long to store in stripe metadata
    // Instead, we will generate the 3 reportIds the user buys,
    // and on the checkout-complete page, we will allow them to quickly
    // redeem the report with those details, which are still in the reportContext
    const { quantity } = await req.json();

    console.log("CHECKOUT QUANTITY:", quantity, quantity === 1, quantity === '1');
      
    if (!quantity) {
      return NextResponse.json({ error: 'Missing checkout details' }, { status: 400 });
    }
      
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `${quantity === 1 ? 'Single Landwise Analytica Report' : 'Three Landwise Analytica Reports'}`,
            },
            unit_amount: quantity === 1 ? 129995 : 299995, // In cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',

      metadata: {
        quantity,
      },

      invoice_creation: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      return_url: `${req.headers.get('origin')}/checkout-complete?session_id={CHECKOUT_SESSION_ID}`,
      ui_mode: 'embedded',
    });

    console.log("Session:", session);
      
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: (error as any).statusCode || 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
