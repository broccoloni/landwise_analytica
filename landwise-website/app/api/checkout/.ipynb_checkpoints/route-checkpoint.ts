import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

function getEnvVariable(key: string, fallback: string | null = null): string | null  {
  const value = process.env[key];
  if (!value && fallback === null) {
    throw new Error(`${key} not found in environment variables`);
  }
  return value || fallback;
}

export async function POST(req: Request) {
  try {
    const { quantity, customerId, couponId, priceId, size } = await req.json();

    if (!quantity || quantity <= 0 || !priceId || !size) {
      return NextResponse.json({ error: 'Invalid arguments provided' }, { status: 422 });
    }

    const sessionDetails: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'payment',
      invoice_creation: {
        enabled: true,
      },
      // automatic_tax: {
      //   enabled: true,
      // },
      metadata: { 
        quantity, 
        customerId, 
        size,
      },
      redirect_on_completion: 'never',
      ui_mode: 'embedded',
    }

    if (customerId) {
      sessionDetails.customer = customerId;
    }
    if (couponId) {
      sessionDetails.discounts = [{ coupon: couponId }];
    }
        
    const session = await stripe.checkout.sessions.create(sessionDetails);

    return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in POST /api/checkout:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error in POST /api/checkout:', error);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 422 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: session.status,
      paymentIntent: session.payment_intent,
      customer: session.customer,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in POST /api/checkout:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error in POST /api/checkout:', error);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
