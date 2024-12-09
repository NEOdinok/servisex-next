import { sendOrderDetailsToTelegram } from "@/lib/utils";
import { GetOrdersResponse, GetProductsResponse, TelegramOrderDetails } from "@/types";
import ipRangeCheck from "ip-range-check";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const API_ENDPOINT_PRODUCTS = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
const API_ENDPOINT_ORDERS = "https://goshamartynovich.retailcrm.ru/api/v5/orders";

const validIpRanges = [
  "185.71.76.0/27",
  "185.71.77.0/27",
  "77.75.153.0/25",
  "77.75.156.11",
  "77.75.156.35",
  "77.75.154.128/25",
  "2a02:5180::/32",
];

const isIpValid = (ip: string | null): boolean => {
  if (!ip) return false;
  return ipRangeCheck(ip, validIpRanges);
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    //1. Parse request, env variables
    const notification = await request.json();
    const { id: paymentId, metadata } = notification.object;
    const { orderId }: { orderId: string } = metadata;

    const shopId = process.env.YOOKASSA_TEST_SHOP_ID;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_TEST_KEY;
    const retailCrmApiKey = process.env.NEXT_PUBLIC_RETAIL_CRM_API;
    const notificationIp = request.headers.get("x-forwarded-for") || request.headers.get("client-ip");

    console.log("Received notification from YooKassa:", notification);

    //2. Validate IP
    if (!notificationIp || !isIpValid(notificationIp)) {
      return NextResponse.json({ error: "Forbidden: Invalid IP address" }, { status: 403 });
    }

    console.log("Yookassa IP validated", notificationIp);

    //3. GET product offers in created order
    const ordersResponse = await fetch(`${API_ENDPOINT_ORDERS}?apiKey=${retailCrmApiKey}&id=${orderId}`);
    const orderProductsData: GetOrdersResponse = await ordersResponse.json();
    const order = orderProductsData.orders[0];
    const orderProducts = order?.items;
    const deliveryPrice = order.delivery.cost;
    const productsPrice = order.summ;
    const firstName = order.firstName;
    const lastName = order.lastName;
    const phone = order.phone;
    const email = order.email;
    const address = order.delivery.address.text;
    const delivery = order.delivery.code || "";

    const offersInCreatedOrder = orderProducts.map((product) => product.offer.id);
    console.log("offers in order:", offersInCreatedOrder);

    //3. GET all products
    const productsResponse = await fetch(`${API_ENDPOINT_PRODUCTS}?apiKey=${retailCrmApiKey}`);
    const productsData: GetProductsResponse = await productsResponse.json();
    const products = productsData.products;

    //4. Create a map of offer IDs to their quantities
    // check for out of stock offers
    const offerQuantityMap = new Map<number, number>();
    const outOfStockOffers: number[] = [];

    products.forEach((product) => {
      product.offers.forEach((offer) => {
        offerQuantityMap.set(offer.id, offer.quantity);
      });
    });

    // Check the quantities of the offers in the created order
    offersInCreatedOrder.forEach((offerId) => {
      const quantity = offerQuantityMap.get(offerId);

      if (quantity === 0 || quantity === undefined) {
        outOfStockOffers.push(offerId);
      }
    });

    if (outOfStockOffers.length) {
      const errorIdempotenceKey = uuidv4();
      console.log(`❌ Error! Following items are out of stock: ${outOfStockOffers}`);

      const cancelResponse = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
          "Idempotence-Key": errorIdempotenceKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("❌ Payment canceled successfully");

      if (!cancelResponse.ok) {
        return NextResponse.json(
          { error: `Failed to cancel payment: ${await cancelResponse.text()}` },
          { status: cancelResponse.status },
        );
      }

      if (!retailCrmApiKey) {
        throw new Error("Retail CRM API key is missing.");
      }

      const updateOrderResponse = await fetch(`${API_ENDPOINT_ORDERS}/${orderId}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": retailCrmApiKey,
        },
        body: JSON.stringify({
          by: "id",
          order: JSON.stringify({ status: "no-product" }),
        }),
      });

      if (!updateOrderResponse.ok) {
        return NextResponse.json(
          { error: `Failed to update order status: ${await updateOrderResponse.text()}` },
          { status: updateOrderResponse.status },
        );
      }

      console.log("Order status updated to 'no-product'");
    } else {
      const successIdempotenceKey = uuidv4();
      console.log("🤝 All offers in stock! Proceed to payment");
      // Capture payment
      const captureResponse = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
          "Idempotence-Key": successIdempotenceKey,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ Payment captured successfully! ✅");
      if (!captureResponse.ok) {
        return NextResponse.json(
          { error: `Failed to capture payment: ${await captureResponse.text()}` },
          { status: captureResponse.status },
        );
      }
      if (!retailCrmApiKey) {
        throw new Error("Retail CRM API key is missing.");
      }

      const updateOrderResponse = await fetch(`${API_ENDPOINT_ORDERS}/${orderId}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": retailCrmApiKey,
        },
        body: JSON.stringify({
          by: "id",
          order: JSON.stringify({ status: "availability-confirmed" }),
        }),
      });
      if (!updateOrderResponse.ok) {
        return NextResponse.json(
          { error: `Failed to update order status: ${await updateOrderResponse.text()}` },
          { status: updateOrderResponse.status },
        );
      }

      const telegramOrderDetails: TelegramOrderDetails = {
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        address: address,
        delivery: delivery,
        productsPrice: productsPrice,
        deliveryPrice: deliveryPrice,
        totalPrice: productsPrice + deliveryPrice,
      };

      await sendOrderDetailsToTelegram(telegramOrderDetails);

      console.log("Order status updated to 'availability-confirmed'");
    }

    return NextResponse.json({ message: "Notification processed successfully" });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}
