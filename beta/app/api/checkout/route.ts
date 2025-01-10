import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { quantity } = await req.json();

    const priceId = process.env.STRIPE_REPORT_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Report Price ID not found in environment variables' },
        { status: 400 }
      );
    }

    const couponId = process.env.STRIPE_THREE_REPORT_BUNDLE_COUPON_ID;

    if (!couponId) {
      return NextResponse.json(
        { error: 'Report Coupon ID not found in environment variables' },
        { status: 400 }
      );
    }

    if (!quantity) {
      return NextResponse.json({ error: 'Missing checkout details' }, { status: 400 });
    }

    // Conditionally add coupon if quantity is 3
    const discounts = quantity === 3 ? [{ coupon: couponId }] : undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'payment',
      discounts,
      invoice_creation: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      return_url: `${req.headers.get('origin')}/checkout-complete?session_id={CHECKOUT_SESSION_ID}`,
      ui_mode: 'embedded',
    });

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
