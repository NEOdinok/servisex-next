import { CreateOrderResponse, Order } from "@/types";
import { NextResponse } from "next/server";

const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/orders/create";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(request: Request): Promise<NextResponse<CreateOrderResponse | { error: string }>> {
  const apiKey = process.env.RETAIL_CRM_API;
  let order: Partial<Order>;

  try {
    const requestBody = await request.json();
    order = requestBody.order;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      {
        status: 400,
        headers: createCorsHeaders(),
      },
    );
  }

  if (!order) {
    return NextResponse.json(
      { error: "Missing order data" },
      {
        status: 400,
        headers: createCorsHeaders(),
      },
    );
  }

  try {
    const response = await fetch(`${API_ENDPOINT}?apiKey=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        site: JSON.stringify(order.site),
        order: JSON.stringify(order),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = (await response.json()) as CreateOrderResponse; // Explicitly type as CreateOrderResponse

    return NextResponse.json(data, {
      status: 200,
      headers: createCorsHeaders(),
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      {
        status: 500,
        headers: createCorsHeaders(),
      },
    );
  }
}

function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
