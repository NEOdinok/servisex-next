import { sendOrderDetailsToTelegram } from "@/lib/utils";
import {
  GetOrdersResponse,
  GetProductsResponse,
  TelegramOrderDetails,
  YookassaCapturePaymentBody,
  YookassaPaymentNotification,
} from "@/types";
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
  const notification = await request.json();
  const { id: paymentId } = notification.object;
  const event = notification.event as YookassaPaymentNotification;

  console.log("Event received:", event);
  console.log("Payment id:", paymentId);

  try {
    const { id: paymentId, metadata } = notification.object;
    const event = notification.event as YookassaPaymentNotification;
    const { orderId }: { orderId: string } = metadata;

    const retailCrmApiKey = process.env.NEXT_PUBLIC_RETAIL_CRM_API;
    const notificationIp = request.headers.get("x-forwarded-for") || request.headers.get("client-ip");

    if (!retailCrmApiKey) {
      throw new Error("Retail CRM API key is missing.");
    }
    console.log("[1] Received notification from YooKassa:", notification);

    if (!notificationIp || !isIpValid(notificationIp)) {
      return NextResponse.json({ error: "Forbidden: Invalid IP address" }, { status: 403 });
    }
    console.log("[2] Yookassa IP validated", notificationIp);

    if (event === "payment.canceled") {
      console.error("Error processing the order");
    } else if (event === "payment.waiting_for_capture") {
      const ordersResponse = await fetch(`${API_ENDPOINT_ORDERS}?apiKey=${retailCrmApiKey}&id=${orderId}`);
      const orderProductsData: GetOrdersResponse = await ordersResponse.json();
      const order = orderProductsData.orders[0];

      const value = notification.object.amount.value;
      const currency = notification.object.amount.currency;

      const orderProducts = order?.items;
      const offersInCreatedOrder = orderProducts.map((product) => product.offer.id);

      console.log("[1.1] Processing... Offers in order:", offersInCreatedOrder);

      const productsResponse = await fetch(`${API_ENDPOINT_PRODUCTS}?apiKey=${retailCrmApiKey}`);
      const productsData: GetProductsResponse = await productsResponse.json();
      const products = productsData.products;
      console.log("[1.2] Got all the products");

      const offerQuantityMap = new Map<number, number>();
      const outOfStockOffers: number[] = [];

      products.forEach((product) => {
        product.offers.forEach((offer) => {
          offerQuantityMap.set(offer.id, offer.quantity);
        });
      });
      console.log("[1.3] Create a map of offer - quantity:", offerQuantityMap);

      offersInCreatedOrder.forEach((offerId) => {
        const quantity = offerQuantityMap.get(offerId);

        if (quantity === 0 || quantity === undefined) {
          outOfStockOffers.push(offerId);
        }
      });
      console.log("[1.4] Here's what's out of slock:", outOfStockOffers);

      if (outOfStockOffers.length) {
        console.log(`❌ Error! Following items are out of stock: ${outOfStockOffers}`);
        await cancelPayment(paymentId);

        console.log("❌ Payment canceled successfully");
        await updateOrderStatus(orderId, retailCrmApiKey, "no-product");

        console.log("[1.5] Order status updated to 'no-product'");
      } else {
        console.log("✅ All offers in stock! Proceed to payment");
        const capturePaymenetBody = { amount: { value, currency } };
        await capturePayment(capturePaymenetBody, paymentId);

        console.log("[1.5] proceed to capturing payment");
      }

      return NextResponse.json({ message: "Notification processed successfully" });
    } else if (event === "payment.succeeded") {
      const ordersResponse = await fetch(`${API_ENDPOINT_ORDERS}?apiKey=${retailCrmApiKey}&id=${orderId}`);
      const orderProductsData: GetOrdersResponse = await ordersResponse.json();
      const order = orderProductsData.orders[0];

      const deliveryPrice = order.delivery.cost;
      const customerComment = order.customerComment;
      const productsPrice = order.summ;
      const firstName = order.firstName;
      const lastName = order.lastName;
      const phone = order.phone;
      const email = order.email;
      const address = order.delivery.address.text;
      const delivery = order.delivery.code || "";

      console.log("[2.1] Capturing paymenet");

      console.log("✅ Payment captured successfully!");
      await updateOrderStatus(orderId, retailCrmApiKey, "paid");
      console.log("[2.2] Payment captured");

      const telegramOrderDetails: TelegramOrderDetails = {
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        address: address,
        delivery: delivery,
        productsPrice: productsPrice,
        deliveryPrice: deliveryPrice,
        customerComment: customerComment,
        totalPrice: productsPrice + deliveryPrice,
      };

      await sendOrderDetailsToTelegram(telegramOrderDetails, "paid");

      console.log("[2.3] Order status updated to 'paid'");
    }

    return NextResponse.json({ message: "Notification processed successfully" });
  } catch (error) {
    console.error("Error processing notification:", error);
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}

async function updateOrderStatus(orderId: string, apiKey: string, status: string) {
  const body = new URLSearchParams();

  body.append("by", "id");
  body.append("order", JSON.stringify({ status }));

  const response = await fetch(`${API_ENDPOINT_ORDERS}/${orderId}/edit?apiKey=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${await response.text()}`);
  }

  return response;
}

async function cancelPayment(paymentId: string) {
  const errorIdempotenceKey = uuidv4();

  const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_TEST_KEY;
  const shopId = process.env.NEXT_PUBLIC_YOOKASSA_TEST_SHOP_ID;

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
      "Idempotence-Key": errorIdempotenceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel payment: ${await response.text()}`);
  }

  return response;
}

async function capturePayment(body: YookassaCapturePaymentBody, paymentId: string) {
  const successIdempotenceKey = uuidv4();

  const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_TEST_KEY;
  const shopId = process.env.NEXT_PUBLIC_YOOKASSA_TEST_SHOP_ID;

  const requestBody = body;

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
      "Idempotence-Key": successIdempotenceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to capture payment: ${await response.text()}`);
  }

  return response;
}
