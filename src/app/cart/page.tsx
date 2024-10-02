"use client";
import { BaseLayout } from "@/layouts/BaseLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCart, useProductDialog } from "@/hooks";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  ConfirmationDialog,
  Form,
  CartProductCard,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Label,
  Loading,
  QuantitySelector,
  // Input,
  // RadioGroup,
  // RadioGroupItem,
  // Separator,
  // Tabs,
  // TabsContent,
  // TabsList,
  // TabsTrigger,
} from "@/components";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Имя должно быть более 2 символов",
  }),
  lastName: z.string().min(2, {
    message: "Фамилия должна быть более 2 символов",
  }),
  familyName: z.string().optional(),
  email: z
    .string()
    .min(2, {
      message: "Email должен быть длиннее 2 символов",
    })
    .email({
      message: "Введите корректный email",
    }),
  phone: z
    .string({
      message: "Введите номер",
    })
    .min(2, {
      message: "[Строка] Номер не может быть таким коротким",
    }),
  address: z
    .string({
      message: "Введите",
    })
    .min(2, {
      message: "Введите больше 2 символов",
    }),
});

type CheckoutForm = z.infer<typeof formSchema>;

interface CheckoutBlockProps {
  form: UseFormReturn<CheckoutForm>;
}
const CartEmptyState = () => (
  <p className="text-base font-mono leading-none w-full items-left sm:px-4 sm:py-4 text-muted-foreground">
    Тут пока пусто...
  </p>
);

const CheckoutBlockCart = () => {
  const { isDialogOpen, setIsDialogOpen, offerToRemove, prepareProductForDeletion, handleRemoveProduct } =
    useProductDialog();
  const { items } = useCart();

  return (
    <Card className="border-0 sm:border">
      <p className="text-xxl font-mono text-3xl font-bold w-full items-left sm:px-4 py-4">КОРЗИНА</p>

      <>
        {items.length ? (
          items?.map((product) => (
            <CartProductCard key={product.id} product={product} prepareProductForDeletion={prepareProductForDeletion} />
          ))
        ) : (
          <CartEmptyState />
        )}

        <ConfirmationDialog
          productToRemove={offerToRemove}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          handleRemoveProduct={handleRemoveProduct}
        />
      </>
    </Card>
  );
};

const CartPage = () => {
  const onSubmit = async (values: CheckoutForm) => {
    console.log("[checkout] submit values:", values);
  };

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "Гоша",
      lastName: "Гоша",
      familyName: "Гоша",
      email: "gosha@gmail.com",
      phone: "+79093555555",
      address: "Видное Солнечный 5 кв95",
    },
  });

  return (
    <BaseLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-[1fr_350px] gap-8 py-4 px-2 max-w-screen-lg"
        >
          <div className="grid gap-8">
            <CheckoutBlockCart />
            {/* <CheckoutBlockContacts form={form} />
            <CheckoutBlockDelivery setDeliveryPrice={setDeliveryPrice} />
            <CheckoutBlockPayment /> */}
          </div>
          {/* <CheckoutBlockTotal isLoading={isOrderCreationLoading || isPaymentLoading} deliveryPrice={deliveryPrice} /> */}
        </form>
      </Form>
    </BaseLayout>
  );
};

export default CartPage;
