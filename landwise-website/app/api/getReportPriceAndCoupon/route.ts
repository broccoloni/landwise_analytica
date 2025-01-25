import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    const price = await stripe.prices.retrieve(priceId);
    const coupon = await stripe.coupons.retrieve(couponId);
      
    console.log("Retrieved price and coupon:", price, coupon);
    return NextResponse.json({ price, coupon }, { status: 200 });
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
