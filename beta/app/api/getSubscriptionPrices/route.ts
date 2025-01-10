import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const subscriptionId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
    const subscriptionId_pilot = process.env.STRIPE_PILOT_PROGRAM_PRICE_ID;

    if (!subscriptionId || !subscriptionId_pilot) {
      return NextResponse.json(
        { error: 'Missing one or more subscription Ids from environment variables' },
        { status: 400 }
      );
    }

    const subscription = await stripe.prices.retrieve(subscriptionId, { expand: ['tiers'] });
    const subscription_pilot = await stripe.prices.retrieve(subscriptionId_pilot, { expand: ['tiers'] });

    const prices = { subscription, subscription_pilot };
    console.log("Retrieved subscription prices:", prices);
    return NextResponse.json(prices, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscription prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
