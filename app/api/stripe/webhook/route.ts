import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import stripe from '@/app/lib/stripe'
import Stripe from "stripe";
import { handleStripePayment } from "@/app/server/handle-payment";
import { handleStripeSubscription } from "@/app/server/handle-sbuscription";
import { handleStripeCancelSubscription } from "@/app/server/handle-cancel";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {

    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

  if(!sig || !secret) {
    return NextResponse.json({ error: "No signature or secret" }, { status: 400 });
  }

  const event: Stripe.Event = stripe.webhooks.constructEvent(body, sig, secret);
  
  switch(event.type) {
    case "checkout.session.completed": // Pagamento realizado se status = paid - Pode ser tanto pagamento unico quanto assinatura
      const metadata = event.data.object.metadata;
      // Pagamento unico
      if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
        await handleStripePayment(event);
      }

      // Assinatura
      if(metadata?.price === process.env.STRIPE_SBUSCRIPTION_PRICE_ID) {
        await handleStripeSubscription(event);
      }
      break;
    case "checkout.session.expired": // Expirou o tempo de pagamento
      console.log("Enviar um email para o usuario avisando que o pagamento expirou")  
      break;
    case "checkout.session.async_payment_succeeded": // Boleto Pago
      console.log("Enviar um email para o usuario avisando que o pagamento foi realizado")    
      break;
    case "checkout.session.async_payment_failed": //Boleto Falhou
      console.log("Enviar um email para o usuario avisando que o pagamento falhou")
      break;
    case "customer.subscription.created": // Assinatura Criada
      console.log("Enviar um email para o usuario avisando que a assinatura foi criada")
      break;
    case "customer.subscription.deleted": // Assinatura Cancelada
      await handleStripeCancelSubscription(event);
      break;
    default:
      console.log(`Evento não tratado: ${event.type}`);
      break;
    }

    return NextResponse.json({ message: "Evento recebido com sucesso" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}