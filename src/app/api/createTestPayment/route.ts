import { YookassaCreatePaymentResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const API_ENDPOINT = "https://api.yookassa.ru/v3/payments";

export async function POST(req: NextRequest) {
  try {
    const { value, description, metadata } = await req.json();

    if (!value || !description) {
      return NextResponse.json({ error: "Value and description are required" }, { status: 400 });
    }

    const idempotenceKey = uuidv4();

    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_TEST_SHOP_ID;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_TEST_KEY;

    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/thanks?orderId=${metadata.orderId}`;

    const paymentData = {
      amount: {
        value: value.toFixed(2),
        currency: "RUB",
      },
      capture: false,
      confirmation: {
        type: "redirect",
        return_url: returnUrl,
      },
      description,
      metadata: {
        orderId: metadata.orderId,
      },
      receipt: {
        customer: { email: metadata.email },
        tax_system_code: 2, // УСН доходы (6%)
        items: metadata.items.map((item: any) => ({
          description: item.name,
          quantity: item.quantity,
          amount: {
            value: item.price.toFixed(2),
            currency: "RUB",
          },
          vat_code: 1, // без ндс
          payment_mode: "full_prepayment", // предоплата
          payment_subject: "commodity", // товар
          measure: "piece",
        })),
      },
    };

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data: YookassaCreatePaymentResponse = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
