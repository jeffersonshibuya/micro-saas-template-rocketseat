import { NextRequest, NextResponse } from "next/server";
import mpClient, { validateMercadoPagoWebhook } from "@/app/lib/mercad-pago";
import { Payment } from "mercadopago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";

export async function POST(req: NextRequest) {
  try {
    validateMercadoPagoWebhook(req);

    const body = await req.json();

    const {type, data} = body
    
    // Webhook 
    switch(type) {
      case "payment":
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({id: data.id})
        if(paymentData.status === "approved" || paymentData.status !== null) {
          await handleMercadoPagoPayment(paymentData);
        }
        break;
      case "subscription_preapproval": //Eventos de assinatura
        break;
      default:
        console.log(`Evento não tratado: ${type}`);
        break;
    }
    
    return NextResponse.json({ received: true }, { status: 200 });    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
  }
}