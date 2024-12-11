"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CheckoutBlockCart,
  CheckoutBlockDelivery,
  CheckoutBlockTotal,
  CheckoutFormField,
  Form,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from "@/components";
import { useCart } from "@/hooks";
import { BaseLayout } from "@/layouts/BaseLayout";
import { CheckoutForm, formSchema } from "@/lib/checkout-form";
import {
  CheckoutBlockProps,
  CreateOrderResponse,
  Order,
  YookassaPaymentRequest,
  YookassaPaymentResponse,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const CheckoutBlockContacts = ({ form }: CheckoutBlockProps) => {
  return (
    <Card className="border-0 sm:border">
      <Separator className="sm:hidden" />
      <p className="text-xxl font-mono text-3xl font-bold w-full items-left sm:px-4 py-4">КОНТАКТНАЯ ИНФОРМАЦИЯ</p>
      <CardContent className="grid gap-2 p-0 sm:p-4">
        <CheckoutFormField control={form.control} name="firstName" label="Имя" placeholder="Ванька" />
        <CheckoutFormField control={form.control} name="lastName" label="Фамилия" placeholder="Иванов" />
        <CheckoutFormField control={form.control} name="familyName" label="Отчество" placeholder="Иванович" />
        <CheckoutFormField control={form.control} name="email" label="Почта" placeholder="servisex@sex.com" />
        <CheckoutFormField control={form.control} name="phone" label="Телефон" placeholder="+6 (666) 666 66-69" />
      </CardContent>
    </Card>
  );
};

const CheckoutBlockPayment = () => {
  return (
    <Card className="border-0 sm:border">
      <p className="text-xxl font-mono text-3xl font-bold w-full items-left sm:px-4 py-4">СПОСОБ ОПЛАТЫ</p>
      <CardContent className="p-0 sm:p-4">
        <RadioGroup defaultValue="russian" className="grid gap-">
          <Label htmlFor="russian" className="flex font-mono items-center gap-2 cursor-pointer ">
            <RadioGroupItem id="russian" value="russian" />
            РОССИЙСКАЯ КАРТА
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

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
      firstName: "Гоша",
      lastName: "Гоша",
      familyName: "Гоша",
      email: "gosha@gmail.com",
      phone: "+79093555555",
      address: undefined,
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

  const createTestPaymentMutation = useMutation<YookassaPaymentResponse, Error, YookassaPaymentRequest>({
    mutationFn: async (paymentDetails) => {
      const response = await fetch("/api/createTestPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });
      if (!response.ok) throw new Error("Failed to create payment");
      return response.json() as Promise<YookassaPaymentResponse>;
    },
  });

  const onSubmit = async (values: CheckoutForm) => {
    try {
      setIsSubmitting(true);

      const order = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        items: cartItems.map((item) => ({
          offer: { id: item.id },
          quantity: item.quantity,
        })),
        delivery: {
          cost: deliveryPrice,
          code: "courier",
          address: { text: values.address },
        },
      };

      const createOrderRes = await createOrderMutation.mutateAsync(order);
      console.log("Order created successfully:", createOrderRes);

      const paymentDetails = {
        value: productsPrice + deliveryPrice,
        description: `Created order id: ${createOrderRes.id}}`,
        metadata: { orderId: createOrderRes.id },
      };

      const createPaymentRes = await createTestPaymentMutation.mutateAsync(paymentDetails);

      window.location.href = createPaymentRes.confirmation.confirmation_url;
      setIsSubmitting(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <BaseLayout>
      <Form {...form}>
        <div className="flex justify-center">
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
