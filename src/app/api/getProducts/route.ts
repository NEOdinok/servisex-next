import { retailCrm } from "@/lib/server/config";
import { GetProductsResponse } from "@/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const response = await fetch(`${retailCrm.endpoints.products}?apiKey=${retailCrm.apiKey}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: GetProductsResponse = await response.json();

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed fetching data" },
      {
        status: 500,
      },
    );
  }
}
