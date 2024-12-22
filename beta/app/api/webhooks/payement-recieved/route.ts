import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUser, updateUser } from '@/lib/dbConnect';

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
    case 'payment_intent.succeeded':  
      const paymentIntent = event.data.object;
      console.log("Webhook payment intent:", paymentIntent);
          
      // Generate report ID
      // Check for address and begin generating report if already redeemed
      break;
          
    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse('Success', { status: 200 });
}

