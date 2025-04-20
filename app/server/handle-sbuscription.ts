import "server-only";

import Stripe from "stripe";
import { db } from "../lib/firebase";

export async function handleStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
  if(event.data.object.payment_status === "paid") {
    console.log("Pagamento realizado com sucesso");
  
    const metadata = event.data.object.metadata;
    const userId = metadata?.userId;

    if(!userId) {
      console.log("Não foi possível identificar o usuário");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    })
  }
  else {
    console.log("Pagamento falhou");
  }
}