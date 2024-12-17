import { sendOrderDetailsToTelegram } from "@/lib/utils";
import { GetOrdersResponse, GetProductsResponse, TelegramOrderDetails, YookassaPaymentNotification } from "@/types";
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
    // 1. Parse request, env variables
    const notification = await request.json();
    const { id: paymentId, metadata } = notification.object;
    const event = notification.event as YookassaPaymentNotification;
    const { orderId }: { orderId: string } = metadata;

    const shopId = process.env.NEXT_PUBLIC_YOOKASSA_TEST_SHOP_ID;
    const secretKey = process.env.NEXT_PUBLIC_YOOKASSA_TEST_KEY;
    const retailCrmApiKey = process.env.NEXT_PUBLIC_RETAIL_CRM_API;
    const notificationIp = request.headers.get("x-forwarded-for") || request.headers.get("client-ip");

    if (!retailCrmApiKey) {
      throw new Error("Retail CRM API key is missing.");
    }

    console.log("[1] Received notification from YooKassa:", notification);

    // 2. Validate IP
    if (!notificationIp || !isIpValid(notificationIp)) {
      return NextResponse.json({ error: "Forbidden: Invalid IP address" }, { status: 403 });
    }

    console.log("[2] Yookassa IP validated", notificationIp);

    // 3. Check notification type

    if (event === "payment.canceled") {
      console.error("Error processing the order");
    } else if (event === "payment.waiting_for_capture") {
      // 1) Get offers in the created order
      const ordersResponse = await fetch(`${API_ENDPOINT_ORDERS}?apiKey=${retailCrmApiKey}&id=${orderId}`);
      const orderProductsData: GetOrdersResponse = await ordersResponse.json();
      const order = orderProductsData.orders[0];

      const orderProducts = order?.items;
      const offersInCreatedOrder = orderProducts.map((product) => product.offer.id);

      console.log("[1] Offers in order:", offersInCreatedOrder);

      // 2) Get all products
      const productsResponse = await fetch(`${API_ENDPOINT_PRODUCTS}?apiKey=${retailCrmApiKey}`);
      const productsData: GetProductsResponse = await productsResponse.json();
      const products = productsData.products;
      console.log("[2] Got all the products");

      // 3) Create a map of offer IDs to their quantities check for out of stock offers
      const offerQuantityMap = new Map<number, number>();
      const outOfStockOffers: number[] = [];

      products.forEach((product) => {
        product.offers.forEach((offer) => {
          offerQuantityMap.set(offer.id, offer.quantity);
        });
      });
      console.log("[3] Create a map of offer - quantity:", offerQuantityMap);

      // 4) Find if some offers are out of stock
      offersInCreatedOrder.forEach((offerId) => {
        const quantity = offerQuantityMap.get(offerId);

        if (quantity === 0 || quantity === undefined) {
          outOfStockOffers.push(offerId);
        }
      });
      console.log("[4] Here's what's out of slock:", outOfStockOffers);

      // 5) Capture or cancel payment
      if (outOfStockOffers.length) {
        console.log(`❌ Error! Following items are out of stock: ${outOfStockOffers}`);
        await cancelPayment(paymentId, shopId, secretKey!);

        console.log("❌ Payment canceled successfully");
        await updateOrderStatus(orderId, retailCrmApiKey, "no-product");

        console.log("[5] Order status updated to 'no-product'");
      } else {
        console.log("✅ All offers in stock! Proceed to payment");
        await capturePayment(paymentId, shopId, secretKey!);

        console.log("[5] proceed to capturing payment");
      }

      return NextResponse.json({ message: "Notification processed successfully" });
    } else if (event === "payment.succeeded") {
      // 1) Get order details
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

      console.log("[1] Got all the variables");

      // 2) Process payment
      console.log("✅ Payment captured successfully!");
      await updateOrderStatus(orderId, retailCrmApiKey, "paid");
      console.log("[2] Payment captured");

      // 3) Send details to telegram
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

      console.log("[3] Order status updated to 'paid'");
    }

    return NextResponse.json({ message: "Notification processed successfully" });

    // if (outOfStockOffers.length) {
    //   console.log(`❌ Error! Following items are out of stock: ${outOfStockOffers}`);
    //   await cancelPayment(paymentId, shopId, secretKey!);
    //   console.log("❌ Payment canceled successfully");
    //   await updateOrderStatus(orderId, retailCrmApiKey, "no-product");
    //   console.log("Order status updated to 'no-product'");
    // } else {
    //   console.log("✅ All offers in stock! Proceed to payment");
    //   await capturePayment(paymentId, shopId, secretKey!);
    //   console.log("✅ Payment captured successfully!");
    //   await updateOrderStatus(orderId, retailCrmApiKey, "availability-confirmed");

    //   const telegramOrderDetails: TelegramOrderDetails = {
    //     name: `${firstName} ${lastName}`,
    //     email: email,
    //     phone: phone,
    //     address: address,
    //     delivery: delivery,
    //     productsPrice: productsPrice,
    //     deliveryPrice: deliveryPrice,
    //     customerComment: customerComment,
    //     totalPrice: productsPrice + deliveryPrice,
    //   };

    //   if (event === "payment.succeeded") await sendOrderDetailsToTelegram(telegramOrderDetails);
    //   console.log("Order status updated to 'availability-confirmed'");
    // }
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

async function cancelPayment(paymentId: string, shopId: string | undefined, secretKey: string) {
  const errorIdempotenceKey = uuidv4();

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

async function capturePayment(paymentId: string, shopId: string | undefined, secretKey: string) {
  console.log("credentials:", "paymentId:", paymentId, "shopId:", shopId, "secretKey:", secretKey);
  const successIdempotenceKey = uuidv4();

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
      "Idempotence-Key": successIdempotenceKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to capture payment: ${await response.text()}`);
  }

  return response;
}
