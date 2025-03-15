"use client";

import { Button, Separator } from "@/components";
import { useCart } from "@/hooks";
import { formatPrice } from "@/lib/utils";

type TotalBlockProps = {
  isLoading: boolean;
  deliveryPrice: number | null;
};

export const CheckoutBlockTotal = ({ isLoading, deliveryPrice = 0 }: TotalBlockProps) => {
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
          <h2 className="text-3xl  font-medium">
            ИТАК..
            <br />
            ТВОЙ ЗАКАЗ
          </h2>
          <Button onClick={scrollToTop} variant="outline">
            ИЗМЕНИТЬ
          </Button>
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between ">
            <span>ТОВАРЫ</span>
            <span>{formatPrice(productsPrice)} ₽</span>
          </div>
          <div className="flex justify-between ">
            <span>ДОСТАВКА</span>
            <span>{deliveryPrice} ₽</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium ">
            <span>ИТОГО</span>
            <span>{deliveryPrice ? formatPrice(deliveryPrice + productsPrice) : formatPrice(productsPrice)} ₽</span>
          </div>
        </div>
        <div className="relative group">
          {/* group-hover:visible */}
          {/* <Image src={speed2} alt="Speed gif" className="absolute invisible -top-24 left-0 " /> */}
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
