import { YookassaPaymentResponse } from "@/types";
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

    //TODO: thanks page or page with error
    const returnUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_TEST_SHOP_ID;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_TEST_KEY;

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

    const data = (await response.json()) as YookassaPaymentResponse;

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
