"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import { FieldError, UseFormReturn, useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CartProductCard,
  CheckoutFormField,
  ConfirmationDialog,
  Form,
  Label,
  LoadingEllipsis,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import { useCart, useProductDialog } from "@/hooks";
import { useStore } from "@/hooks";
import { BaseLayout } from "@/layouts/BaseLayout";
import { CheckoutForm, formSchema } from "@/lib/checkout-form";
import { cn, formatPrice } from "@/lib/utils";
import { CreateOrderResponse, Order, PickupPoint, YookassaPaymentResponse } from "@/types";
import { YookassaPaymentRequest } from "@/types/yookassa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Script from "next/script";

interface CheckoutBlockProps {
  form: UseFormReturn<CheckoutForm>;
}

const CartEmptyState = () => (
  <p className="text-base font-mono leading-none w-full items-left sm:px-4 sm:py-4 text-muted-foreground">
    Тут пока пусто...
  </p>
);

const CheckoutBlockCart: React.FC = () => {
  const { isDialogOpen, setIsDialogOpen, offerToRemove, prepareProductForDeletion, handleRemoveProduct } =
    useProductDialog();

  // const { items, hasHydrated } = useCart();
  // TODO this Zustand way of hook inside hook looks horrible
  // This is only used here for hasHydrated to work
  const items = useStore(useCart, (state) => state.items);
  const hasHydrated = useStore(useCart, (state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <Card className="border-0 sm:border">
        <p className="text-xxl font-mono text-3xl font-bold w-full items-left sm:px-4 py-4">КОРЗИНА</p>
      </Card>
    );
  }

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
            <span>{formatPrice(productsPrice)} ₽</span>
          </div>
          <div className="flex justify-between font-mono">
            <span>ДОСТАВКА</span>
            <span>{deliveryPrice} ₽</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium font-mono">
            <span>ИТОГО</span>
            <span>{deliveryPrice ? formatPrice(deliveryPrice + productsPrice) : formatPrice(productsPrice)} ₽</span>
          </div>
        </div>
        <div className="relative group">
          {/* group-hover:visible */}
          {/* <img src={speed2} alt="Speed gif" className="absolute invisible -top-24 left-0 " /> */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isLoading}
            disabled={cartItemsCount === 0 || isLoading}
          >
            ОПЛАТИТЬ
          </Button>
        </div>
      </div>
    </>
  );
};

interface DeliveryBlockProps extends CheckoutBlockProps {
  setDeliveryPrice: React.Dispatch<SetStateAction<number>>;
}

const CheckoutBlockDelivery = ({ setDeliveryPrice, form }: DeliveryBlockProps) => {
  const [pickupPointAddress, setPickupPointAddress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("delivery");
  const [isWidgetReady, setIsWidgetReady] = useState<boolean>(false);
  const addressErrorRef = useRef<HTMLSpanElement | null>(null);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const { formState, setValue, trigger } = form;
  const addressError = formState.errors.address as FieldError | undefined;

  // Only scroll to address if no errors in contacts
  const anyErrorApartFromAddress =
    (formState.errors.firstName as FieldError) ||
    (formState.errors.lastName as FieldError) ||
    (formState.errors.email as FieldError) ||
    (formState.errors.phone as FieldError);

  // This eslint disable helps us only scroll to address error when submit btn is re-clicked
  // If we keep anyErrorApartFromAddress in a dependency array then page is scrolled weirdly as soon as
  // letters are typed in an input.
  // ***
  // This leads to error inputs being impossible to type in
  // And weird scroll behavior. Page does not even scroll to address error
  // it does a random scroll
  useEffect(() => {
    if (!anyErrorApartFromAddress && addressError && addressErrorRef.current) {
      addressErrorRef.current.scrollIntoView({ behavior: "instant", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressError]);

  const onTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (pickupPointAddress) {
      setValue("address", pickupPointAddress);
      trigger("address");
    }
  }, [pickupPointAddress, setValue, trigger]);

  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  useEffect(() => {
    getUserLocation()
      .then((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
      })
      .catch((error) => {
        console.error("Error getting user location. Fallback to Moscow Kremlin 🇷🇺🐻🪆:", error);
        setUserLocation([37.617664, 55.752121]);
      });
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !userLocation) return;

    const initializeCDEKWidget = (
      servicePath: string,
      setPickupPointAddress: React.Dispatch<React.SetStateAction<string>>,
      setPrice: React.Dispatch<React.SetStateAction<number>>,
      setIsWidgetReady: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      if (!document.getElementById("cdek-map")) return;

      const cdekWidget = new window.CDEKWidget({
        from: {
          country_code: "RU",
          city: "Видное",
          postal_code: 142701,
          code: 1100,
          address: "ул. Советская, 10/1",
        },
        canChoose: true,
        hideFilters: {
          have_cashless: false,
          have_cash: false,
          is_dressing_room: false,
          type: false,
        },
        hideDeliveryOptions: {
          office: false,
          door: true,
        },
        defaultLocation: userLocation,
        goods: [
          {
            width: 10,
            height: 10,
            length: 10,
            weight: 10,
          },
        ],
        root: "cdek-map",
        apiKey: process.env.NEXT_PUBLIC_YANDEX_MAPS_SECRET,
        servicePath: servicePath,
        lang: "rus",
        currency: "RUB",
        tariffs: {
          office: [234, 136, 138],
          door: [233, 137, 139],
        },
        onReady() {
          setIsWidgetReady(true); // Hide loading component
        },
        onChoose(mode: unknown, second: { delivery_sum: number }, office: PickupPoint) {
          console.log("[Widget] onChoose", mode, "second:", second, "office:", office);
          setPickupPointAddress(`${office.city} ${office.address}`);
          setPrice(second.delivery_sum);
        },
        onCalculate(obj: unknown) {
          console.log("[Widget] onCalculate", obj);
        },
      });

      if (cdekWidget) {
        window.CDEKWidgetInitialized = true;
      }
    };

    const servicePath = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cdek`;

    if (document.getElementById("cdek-map") && !window.CDEKWidgetInitialized) {
      setIsWidgetReady(false);
      initializeCDEKWidget(servicePath, setPickupPointAddress, setDeliveryPrice, setIsWidgetReady);
    }
  }, [isScriptLoaded, setPickupPointAddress, setDeliveryPrice, userLocation]);

  return (
    <>
      <div>
        <p className="text-xxl font-mono text-3xl font-bold w-full items-left pb-4">ДОСТАВКА</p>
        <Tabs className="relative flex flex-col" defaultValue="delivery" onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="delivery" className="w-full font-mono rounded-none p-0 h-full">
              ДОСТАВКА
            </TabsTrigger>
            <TabsTrigger value="pickup" className="w-full font-mono rounded-none p-0 h-full">
              САМОВЫВОЗ
            </TabsTrigger>
          </TabsList>

          <div className={cn("relative overflow-clip", activeTab === "delivery" ? "h-delivery-tab" : "h-pickup-tab")}>
            <TabsContent
              value="delivery"
              className={cn("absolute top-0 w-full", activeTab === "delivery" ? "" : "invisible")}
            >
              <div id="cdek-tab" className="relative flex flex-col p-0">
                <div
                  id="cdek-map"
                  className={cn("", !isWidgetReady ? "hidden" : "h-96")}
                  ref={widgetContainerRef}
                ></div>
                {!isWidgetReady && (
                  <div className="h-96 flex flex-col items-center justify-center">
                    <LoadingEllipsis text="СДЭК" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="pickup"
              className={cn("absolute top-0 w-full", activeTab === "pickup" ? "" : "invisible")}
            >
              <div className="font-mono">
                Электролитный Проезд, 3, строение 19, Москва, Россия, 115230 <br />
                <br />
                10:00 - 18:00 <br />
                Каждый день
              </div>
            </TabsContent>
          </div>
          {pickupPointAddress && (
            <div className="flex flex-col gap-0 items-start justify-center mt-2">
              <span className="font-mono">Выбранный пункт:</span>
              <span className="font-mono">{pickupPointAddress}</span>
            </div>
          )}
          {addressError && (
            <span className="text-xs text-error mt-2" ref={addressErrorRef}>
              {addressError.message}
            </span>
          )}
        </Tabs>
      </div>
      <Script
        src="https://cdn.jsdelivr.net/npm/@cdek-it/widget@3"
        strategy="afterInteractive"
        async
        onLoad={() => setIsScriptLoaded(true)}
      />
      <style>
        {`
          input {
            background-color: transparent !important;// cdek fix
          }
        `}
      </style>
    </>
  );
};

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
        items: cartItems.map((item) => ({
          offer: { id: item.id },
          quantity: item.quantity,
        })),
        delivery: {
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
