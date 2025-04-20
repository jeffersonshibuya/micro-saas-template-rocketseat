import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercad-pago";

export async function POST(req: NextRequest) {
  const { testId, userEmail } = await req.json();

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: testId, //id do pedido por exemplo - Isso impacta na pontuação do Mercado Pago
        metadata: {
          testId, // Essa variavel é convertida para snake_case -> test_id
        },
        ...(userEmail && {payer: {email: userEmail}}),
        items: [
          {id: "", description: "", title: "",quantity: 1, unit_price: 1, currency_id: "BRL", category_id: "services"}
        ],
        payment_methods: {
          installments: 12,
          excluded_payment_methods: [
            {id: "bolbradesco"},
            {id: "pec"}
          ],
          auto_return: "approved",
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercad-pago/pending`,
            pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercad-pago/pending`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercad-pago/pending`,
          },
          // excluded_payment_types: [
          //   {id: "debit_card"},
          // ],
          // default_payment_method_id: "visa",
          
        }
      },
    });

    if(!createdPreference.id) {
      return NextResponse.json({ error: "Erro ao criar checkout" }, { status: 500 });
    }

    return NextResponse.json({ preferenceId: createdPreference.id, initPoint: createdPreference.init_point }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro ao criar checkout" }, { status: 500 });
  }
}
