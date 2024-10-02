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
  Separator,
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

interface TotalBlockProps {
  isLoading: boolean;
  deliveryPrice: number | null;
}

const CheckoutBlockTotal = ({ isLoading, deliveryPrice = 0 }: TotalBlockProps) => {
  // const productsPrice = useAppSelector((state: RootState) => selectCartTotalPrice(state));
  // const cartItemsCount = useAppSelector((state: RootState) => selectCartItemCount(state));
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
              {/* <CheckoutBlockContacts form={form} />
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
