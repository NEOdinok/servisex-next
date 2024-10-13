import { NextResponse } from "next/server";

const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "Product IDs are required" }, { status: 400, headers: createCorsHeaders() });
  }

  const idsArray = ids.split(",");
  const filterParams = idsArray.map((id) => `filter[ids][]=${id}`).join("&");

  try {
    const response = await fetch(`${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}&${filterParams}`);
    const data = await response.json();

    return NextResponse.json(data, { headers: createCorsHeaders() });
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
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
