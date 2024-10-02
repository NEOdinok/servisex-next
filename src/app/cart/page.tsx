"use client";
import { BaseLayout } from "@/layouts/BaseLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useCart, useProductDialog } from "@/hooks";
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
  Input,
  // RadioGroup,
  // RadioGroupItem,
  Separator,
  CheckoutFormField,
  // Tabs,
  // TabsContent,
  // TabsList,
  // TabsTrigger,
} from "@/components";
import { formSchema, CheckoutForm } from "@/lib/checkout-form";

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

interface TotalBlockProps {
  isLoading: boolean;
  deliveryPrice: number | null;
}

const CheckoutBlockTotal = ({ isLoading, deliveryPrice = 0 }: TotalBlockProps) => {
  const { items } = useCart();
  const cartItemsCount = items.length;
  const productsPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="sticky top-16 h-fit bg-background space-y-4 md:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-mono font-medium">
            ИТАК..
            <br />
            ТВОЙ ЗАКАЗ
          </h2>
          <Button onClick={scrollToTop} variant="outline">
            ИЗМЕНИТЬ
          </Button>
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between font-mono">
            <span>ТОВАРЫ</span>
            <span>{productsPrice} ₽</span>
          </div>
          <div className="flex justify-between font-mono">
            <span>ДОСТАВКА</span>
            <span>{deliveryPrice} ₽</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium font-mono">
            <span>ИТОГО</span>
            <span>{deliveryPrice ? deliveryPrice + productsPrice : productsPrice} ₽</span>
          </div>
        </div>
        <div className="relative group">
          {/* group-hover:visible */}
          {/* <img src={speed2} alt="Speed gif" className="absolute invisible -top-24 left-0 " /> */}
          <Button type="submit" size="lg" className="w-full" loading={isLoading} disabled={cartItemsCount === 0}>
            ОПЛАТИТЬ
          </Button>
        </div>
      </div>
    </>
  );
};

const CheckoutBlockContacts = ({ form }: CheckoutBlockProps) => {
  return (
    <Card className="border-0 sm:border">
      <Separator className="sm:hidden" />
      <p className="text-xxl font-mono text-3xl font-bold w-full items-left sm:px-4 py-4">КОНТАКТНАЯ ИНФОРМАЦИЯ</p>
      <CardContent className="grid gap-2 p-0 sm:p-4">
        <CheckoutFormField control={form.control} name="firstName" label="Имя" placeholder="Козел" />
        <CheckoutFormField control={form.control} name="lastName" label="Фамилия" placeholder="Козлов" />
        <CheckoutFormField control={form.control} name="familyName" label="Отчество" placeholder="Козлович" />
        <CheckoutFormField control={form.control} name="email" label="Почта" placeholder="kozel666@goatcorp.com" />
        <CheckoutFormField control={form.control} name="phone" label="Телефон" placeholder="+6 (666) 666 66-66" />
      </CardContent>
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
        <div className="flex justify-center">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-[1fr_350px] gap-8 py-4 px-2 w-full max-w-screen-lg"
          >
            <div className="grid gap-8">
              <CheckoutBlockCart />
              <CheckoutBlockContacts form={form} />
              {/*
            <CheckoutBlockDelivery setDeliveryPrice={setDeliveryPrice} />
            <CheckoutBlockPayment /> */}
            </div>
            {/* isOrderCreationLoading || isPaymentLoading */}
            <CheckoutBlockTotal isLoading={false} deliveryPrice={0} />
          </form>
        </div>
      </Form>
    </BaseLayout>
  );
};

export default CartPage;
