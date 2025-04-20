import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  async function createPaymentStripeCheckout(checkoutData: { testId: string }) {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-pay-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function createSubscriptionStripeCheckout(checkoutData: {
    testId: string;
  }) {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateStripePortal() {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-stripe-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("data", data);

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  };
}
