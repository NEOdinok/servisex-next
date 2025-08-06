"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { FieldError, useWatch } from "react-hook-form";

import { LoadingEllipsis, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { cn } from "@/lib/utils";
import type { CdekSelectedAddress, CdekSelectedDeliveryMode, CdekSelectedTariff, DeliveryMethods } from "@/types";
import type { CheckoutBlockProps } from "@/types";
import Script from "next/script";

type SetState<T> = Dispatch<SetStateAction<T>>;

type DeliveryBlockProps = CheckoutBlockProps & {
  setDeliveryPrice: SetState<number>;
};

export const CheckoutBlockDelivery = ({ setDeliveryPrice, form }: DeliveryBlockProps) => {
  const [isWidgetReady, setIsWidgetReady] = useState<boolean>(false);
  const addressErrorRef = useRef<HTMLSpanElement | null>(null);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const deliveryMethod = useWatch({
    control: form.control,
    name: "deliveryMethod",
  });

  const deliveryTabActive = deliveryMethod === "delivery";

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
    form.setValue("deliveryMethod", value as DeliveryMethods);
  };

  const pickupPointAddress = useWatch({
    control: form.control,
    name: "address",
  });

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
      setPrice: React.Dispatch<React.SetStateAction<number>>,
      setIsWidgetReady: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
      if (!document.getElementById("cdek-map")) return;

      const cdekWidget = new window.CDEKWidget({
        from: {
          address: "ул. Интернациональная, 3",
          city: "Лида",
          //city_code
          code: 8635,
          country_code: "BY",
          postal_code: 231300,
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
        onChoose(mode: CdekSelectedDeliveryMode, tariff: CdekSelectedTariff, office: CdekSelectedAddress) {
          setPrice(tariff.delivery_sum);
          console.log("address:", office);
          form.setValue("address", `${office.city} ${office.address}`);
          form.setValue("deliveryTariff", `${tariff.tariff_description} ${tariff.tariff_name}`);
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
      initializeCDEKWidget(servicePath, setDeliveryPrice, setIsWidgetReady);
    }
  }, [isScriptLoaded, setDeliveryPrice, userLocation, form]);

  return (
    <>
      <div>
        <p className="text-xxl  text-3xl font-bold w-full items-left pb-4">ДОСТАВКА</p>
        <Tabs className="relative flex flex-col" defaultValue="delivery" onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="delivery" className="w-full  rounded-none p-0 h-full">
              ДОСТАВКА
            </TabsTrigger>
            <TabsTrigger value="pickup" className="w-full  rounded-none p-0 h-full">
              САМОВЫВОЗ
            </TabsTrigger>
          </TabsList>

          <div
            className={cn("relative overflow-clip", deliveryMethod === "delivery" ? "h-delivery-tab" : "h-pickup-tab")}
          >
            <TabsContent
              value="delivery"
              className={cn("absolute top-0 w-full", deliveryMethod === "delivery" ? "" : "invisible")}
            >
              <div id="cdek-tab" className="relative flex flex-col p-0">
                <div id="cdek-map" className={!isWidgetReady ? "hidden" : "h-96"} ref={widgetContainerRef}></div>

                {!isWidgetReady && <WidgetLoadingState />}
              </div>
            </TabsContent>

            <TabsContent
              value="pickup"
              className={cn("absolute top-0 w-full", deliveryMethod === "pickup" ? "" : "invisible")}
            >
              <div className="">
                Лида, Беларусь улица улицы, дом дома
                <br />
                <br />
                10:00 - 18:00 <br />
                Каждый день
              </div>
            </TabsContent>
          </div>
          {pickupPointAddress && deliveryTabActive && (
            <div className="flex flex-col gap-0 items-start justify-center mt-2">
              <span className="">Выбранный пункт:</span>
              <span className="">{pickupPointAddress}</span>
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

const WidgetLoadingState = () => {
  const [showHint, setShowHint] = useState(false);
  const reloadTextTimeout = 20000;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowHint(true);
    }, reloadTextTimeout);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-96 flex flex-col items-center justify-center">
      <LoadingEllipsis text="СДЭК" />
      {showHint && <p className="mt-4 text-sm text-gray-500">Если устали ждать — перезагрузите страницу</p>}
    </div>
  );
};
