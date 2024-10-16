import { GetProductsResponse } from "@/types";
import { NextResponse } from "next/server";

// Make sure this path points to where your types are defined

const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const response = await fetch(`${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: GetProductsResponse = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: createCorsHeaders(),
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed fetching data" },
      {
        status: 500,
        headers: createCorsHeaders(),
      },
    );
  }
}

function createCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
