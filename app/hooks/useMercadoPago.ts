import { useRouter } from "next/navigation"
import { initMercadoPago } from "@mercadopago/sdk-react"
import { useEffect } from "react"

export default function useMercadoPago() {
  const router = useRouter()

  useEffect(() => {
    initMercadoPago(process.env.MERCADO_PAGO_PUBLIC_KEY!)
  }, [])

  async function createMercadoPagoCheckout({testId, userEmail}:{testId: string, userEmail: string}) {

    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        body: JSON.stringify({testId, userEmail})
      })

      const data = await response.json()

      router.push(data.initPoint)

      return data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  
  
  return {
    createMercadoPagoCheckout
  }
}