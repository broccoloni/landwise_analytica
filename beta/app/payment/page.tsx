import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import Loading from '@/components/Loading';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// THIS PAGE IS NOT CURRENTLY USED AS WE ARE CURRENTLY USING A STRIPE HOSTED FORM
// AND THIS IS FOR A STRIPE EMBEDDED FORM

export default function Checkout() {
    
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: 3 }),
  });

    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = {fetchClientSecret};

  return (
    <div id="checkout">
      <div className="mb-4">
        <ProgressBar steps={steps} currentStep={currentStep} />
      </div>
      <div className="flex justify-center items-center bg-white m-2 rounded-lg">
        {loading ? (
          <Loading />
        ) : (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={options}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}
