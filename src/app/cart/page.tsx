"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  CheckoutBlockCart,
  CheckoutBlockContacts,
  CheckoutBlockDelivery,
  CheckoutBlockPayment,
  CheckoutBlockTotal,
  Form,
} from "@/components";
import { useCart } from "@/hooks";
import { BaseLayout } from "@/layouts/BaseLayout";
import { CheckoutForm, formSchema } from "@/lib/checkout-form";
import { getCreatePaymentApiPath, sendOrderDetailsToTelegram } from "@/lib/utils";
import {
  CreateOrderResponse,
  Order,
  TelegramOrderDetails,
  YookassaPaymentRequest,
  YookassaPaymentResponse,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const CartPage = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const { items: cartItems } = useCart();

  const productsPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      familyName: "",
      email: "",
      phone: "",
      address: "",
      deliveryMethod: "delivery",
    },
  });

  const createOrderMutation = useMutation<CreateOrderResponse, Error, Partial<Order>>({
    mutationFn: async (order) => {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json() as Promise<CreateOrderResponse>;
    },
  });

  const createPaymentMutation = useMutation<YookassaPaymentResponse, Error, YookassaPaymentRequest>({
    mutationFn: async (paymentDetails) => {
      const paymentApi = getCreatePaymentApiPath();
      const response = await fetch(paymentApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });
      if (!response.ok) throw new Error("Failed to create payment");
      return response.json() as Promise<YookassaPaymentResponse>;
    },
  });

  const onSubmit = async (values: CheckoutForm) => {
    const shouldAddAddres = form.getValues("deliveryMethod") === "delivery";

    try {
      setIsSubmitting(true);

      const telegramOrderDetails: TelegramOrderDetails = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        address: values.address,
        delivery: values.deliveryMethod,
        customerComment: values.deliveryTariff,
        productsPrice: productsPrice,
        deliveryPrice: deliveryPrice,
        totalPrice: productsPrice + deliveryPrice,
      };

      await sendOrderDetailsToTelegram(telegramOrderDetails, "created");

      const order: Partial<Order> = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        customerComment: `Тариф доставки: ${values.deliveryTariff ?? ""}`,
        items: cartItems.map((item) => ({
          offer: { id: item.id },
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        delivery: {
          cost: deliveryPrice,
          code: values.deliveryMethod,
          address: { text: shouldAddAddres ? values.address : "" },
        },
      };

      const createOrderRes = await createOrderMutation.mutateAsync(order);

      const paymentDetails = {
        value: productsPrice + deliveryPrice,
        description: `Created order id: ${createOrderRes.id}`,
        metadata: { orderId: createOrderRes.id, order },
      };

      const createPaymentRes = await createPaymentMutation.mutateAsync(paymentDetails);

      window.location.href = createPaymentRes.confirmation.confirmation_url;
      setIsSubmitting(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <BaseLayout>
      <Form {...form}>
        <div className="flex w-full justify-center">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-[1fr_350px] gap-8 py-4 px-2 w-full max-w-screen-lg"
          >
            <div className="grid gap-8">
              <CheckoutBlockCart />
              <CheckoutBlockContacts form={form} />
              <CheckoutBlockDelivery setDeliveryPrice={setDeliveryPrice} form={form} />
              <CheckoutBlockPayment />
            </div>
            {/* isOrderCreationLoading || isPaymentLoading */}
            <CheckoutBlockTotal isLoading={isSubmitting} deliveryPrice={deliveryPrice} />
          </form>
        </div>
      </Form>
    </BaseLayout>
  );
};

export default CartPage;
