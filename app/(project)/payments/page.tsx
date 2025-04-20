"use client"

import { useStripe } from "@/app/hooks/useStripe"

export default function PaymentPage() {
  const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe()

  return (
    <div>
      <h1>Payments</h1>
      <button onClick={() => createPaymentStripeCheckout({testId: "123"})} className="border rounded-md px-1 cursor-pointer">Criar Pagamento</button>
      <button onClick={() => createSubscriptionStripeCheckout({testId: "123"})} className="border rounded-md px-1 cursor-pointer">Criar Assinatura Stripe</button>
      <button onClick={() => handleCreateStripePortal()} className="border rounded-md px-1 cursor-pointer">Criar Porta de Pagamentos</button>
    </div>
  )
}