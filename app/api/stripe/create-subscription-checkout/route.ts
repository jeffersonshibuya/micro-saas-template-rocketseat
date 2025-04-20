import { auth } from "@/app/lib/auth";
import stripe from "@/app/lib/stripe";
import { getOrCreateCustomer } from "@/app/server/get-customer-id";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  const { testId } = await request.json();

  const price = process.env.STRIPE_SBUSCRIPTION_PRICE_ID;
  if(!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if(!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // precisamos criar um cliente NA STRIPE para ter referencia dele quando for criar o portal
  // se nao criar, ele vai criar um novo cliente na stripe e nao vai estar associado ao usuario do firebase
  // entao nao conseguiremos associar o pagamento ao usuario do firebase
  // esta função pega o usuario do firebase e cria um cliente na stripe se nao existir ou retorna o cliente existente
  const customerId = await getOrCreateCustomer(userId, userEmail);

  const metadata = {
    testId,
    price,
    userId
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{price, quantity: 1}],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/`,
      // ...(userEmail && {customer_email: userEmail}),
      metadata
    })

    if(!session.url) {
      return NextResponse.json({ error: "Session URL not found" }, { status: 500 });
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
