import "server-only";

import Stripe from "stripe";
import { db } from "../lib/firebase";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const customerId = event.data.object.customer;

  const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).limit(1).get();

  if(userRef.empty) {
    console.log("Não foi possível identificar o usuário");
    return;
  }

  const userId = userRef.docs[0].id;

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive",
  })
}