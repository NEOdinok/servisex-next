import { Card, CardContent, ImageSlider, Label } from "@/components";
import { formatPrice } from "@/lib/utils";
import type { ShopItem } from "@/types";
import Link from "next/link";

interface Props {
  product: ShopItem;
}

export const ShopProductCard = ({ product }: Props) => {
  return (
    <Link
      className={"h-full w-full cursor-pointer group/main"}
      href={`/shop/${product.parentProductId}/${product.color}`}
    >
      <Card
        className={`cursor-pointer group h-full flex flex-col relative ${
          product.isOutOfStock ? "pointer-events-none" : ""
        }`}
      >
        <div className="relative">
          <ImageSlider urls={product.imgs} />
          {product.isOutOfStock && <ProductOutOfStockState />}
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
    </Link>
  );
};

const ProductOutOfStockState: React.FC = () => {
  return (
    <div className="absolute z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <span className="text-error text-xl font-bold uppercase font-mono">распродано</span>
    </div>
  );
};
