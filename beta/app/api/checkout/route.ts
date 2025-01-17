import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

function getEnvVariable(key, fallback = null) {
  const value = process.env[key];
  if (!value && fallback === null) {
    throw new Error(`${key} not found in environment variables`);
  }
  return value || fallback;
}

export async function POST(req) {
  try {
    const { quantity, customerId, couponId } = await req.json();

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid quantity provided' }, { status: 422 });
    }

    const priceId = getEnvVariable('STRIPE_REPORT_PRICE_ID');

    const discounts = couponId ? [{ coupon: couponId }] : undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId || undefined,
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
      // automatic_tax: {
      //   enabled: true,
      // },
      metadata: { 
        quantity, 
        customerId, 
      },
      redirect_on_completion: 'never',
      ui_mode: 'embedded',
    });

    return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (error) {
    console.error('Error in POST /api/checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
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
  } catch (error) {
    console.error('Error in GET /api/checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
