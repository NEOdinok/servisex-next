"use client";

import { MouseEvent } from "react";

import { Button, CardContent, QuantitySelector } from "@/components";
import { formatPrice } from "@/lib/utils";
import { CartItem, PossibleOffer } from "@/types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartProductCardProps {
  product: CartItem;
  prepareProductForDeletion: (offer: PossibleOffer | CartItem) => void;
}

export const CartProductCard = ({ product, prepareProductForDeletion }: CartProductCardProps) => {
  const router = useRouter();
  const handleRemoveProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    prepareProductForDeletion(product);
  };

  const handleClick = () => {
    router.push(`/shop/${product.parentProductId}/${product.properties.color || "one-color"}`);
  };

  return (
    <CardContent className="p-0 py-2 sm:p-4">
      <div className="grid gap-2 cursor-pointer">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-mono font-medium uppercase hover:underline" onClick={handleClick}>
            {product.parentProductName}
          </h3>
          <Button variant="ghost" size="icon" onClick={(e) => handleRemoveProduct(e)}>
            <X />
          </Button>
        </div>
        <div className="grid grid-cols-[64px_1fr_auto] items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt="Product template" width={64} height={64} />
          <div>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground ">
              Цвет: {product.properties?.color ? <>{product.properties?.color} </> : <>Один цвет</>}
            </p>
            <p className="font-mono text-xs md:text-sm text-muted-foreground ">
              Размер: {product.properties?.size ? <>{product.properties?.size}</> : <>Один размер</>}
            </p>
            <p className="font-mono text-xs md:text-sm text-muted-foreground ">Цена: {formatPrice(product.price)} ₽</p>
          </div>
          <QuantitySelector offer={product} prepareProductForDeletion={prepareProductForDeletion} />
        </div>
      </div>
    </CardContent>
  );
};
