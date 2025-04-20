import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export const handleMercadoPagoPayment = async (paymentData: PaymentResponse) => {

  const metadata = paymentData.metadata
  const userEmail = metadata.user_email  
  const testId = metadata.test_id  

  console.log("Pagamento com sucesso", paymentData)
  
}