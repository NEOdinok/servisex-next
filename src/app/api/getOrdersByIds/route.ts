import { GetOrdersResponse } from "@/types";
import { NextResponse } from "next/server";

const API_ENDPOINT_ORDERS = "https://goshamartynovich.retailcrm.ru/api/v5/orders";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "Order IDs are required" }, { status: 400, headers: createCorsHeaders() });
  }

  const idsArray = ids.split(",");
  const filterParams = idsArray.map((id) => `filter[ids][]=${id}`).join("&");

  try {
    const response = await fetch(`${API_ENDPOINT_ORDERS}?apiKey=${process.env.RETAIL_CRM_API}&${filterParams}`);
    const data: GetOrdersResponse = await response.json();

    return NextResponse.json(data, { headers: createCorsHeaders() });
  } catch (error) {
    console.error("Error fetching orders by IDs:", error);
    return NextResponse.json({ error: "Failed fetching data" }, { status: 500, headers: createCorsHeaders() });
  }
}

function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
