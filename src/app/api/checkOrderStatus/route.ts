import { retailCrm } from "@/lib/server/config";
import { GetOrdersResponse } from "@/types";
import { NextResponse } from "next/server";

const API_ENDPOINT_ORDERS = "https://goshamartynovich.retailcrm.ru/api/v5/orders";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("id");

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400, headers: createCorsHeaders() });
  }

  try {
    const response = await fetch(`${retailCrm.endpoints.orders}?apiKey=${retailCrm.apiKey}&filter[ids][]=${orderId}`);
    const data: GetOrdersResponse = await response.json();

    if (!data.success || !data.orders || data.orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404, headers: createCorsHeaders() });
    }

    const orderStatus = data.orders[0].status;

    return NextResponse.json({ status: orderStatus }, { headers: createCorsHeaders() });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json({ error: "Failed fetching order status" }, { status: 500, headers: createCorsHeaders() });
  }
}

function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
