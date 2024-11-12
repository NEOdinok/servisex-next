/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, Label } from "@/components";
import { formatPrice } from "@/lib/utils";
import type { ShopItem } from "@/types";
import Image from "next/image";

interface Props {
  product: ShopItem;
  onClick?: () => void;
}

export const ShopProductCard = ({ product, onClick }: Props) => {
  const showAnimation = true;

  return (
    <Card
      className={`cursor-pointer group h-full flex flex-col relative ${
        product.isOutOfStock ? "pointer-events-none" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={product.imgs[0]}
          alt={product.name}
          layout="responsive"
          unoptimized
          width={1}
          height={1}
          className={`aspect-square w-full h-auto object-cover ${
            product.isOutOfStock
              ? "opacity-50"
              : "group-hover:opacity-70 group-hover:border-2 group-hover:border-primary"
          }`}
        />
        {product.isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-error text-xl font-bold uppercase font-mono">распродано</span>
          </div>
        )}
      </div>
      <CardContent className="h-full">
        <div className="grid w-full h-full items-center gap-4">
          <div className="flex flex-col space-y-1.5 gap-2 font-mono">
            <Label className="font-mono font-normal">{product.name}</Label>
            <Label className="font-mono font-normal">{formatPrice(product.price)} ₽</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
