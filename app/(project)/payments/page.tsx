"use client"

import useMercadoPago from "@/app/hooks/useMercadoPago"
import { useStripe } from "@/app/hooks/useStripe"

export default function PaymentPage() {
  const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe()
  const { createMercadoPagoCheckout,  } = useMercadoPago()

  return (
    <div>
      <h1>Payments - Stripe</h1>
      <button onClick={() => createPaymentStripeCheckout({testId: "123"})} className="border rounded-md px-1 cursor-pointer">Criar Pagamento</button>
      <button onClick={() => createSubscriptionStripeCheckout({testId: "123"})} className="border rounded-md px-1 cursor-pointer">Criar Assinatura Stripe</button>
      <button onClick={() => handleCreateStripePortal()} className="border rounded-md px-1 cursor-pointer">Criar Porta de Pagamentos</button>
      
      <hr />
      <h1>Payments - Mercado Pago</h1>
      <button onClick={() => createMercadoPagoCheckout({testId: "123", userEmail: "test@email.com"})} className="border rounded-md px-1 cursor-pointer">Criar Pagamento</button>
    </div>
  )
}