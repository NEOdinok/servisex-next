import { Card, CardContent, ImageSlider, Label } from "@/components";
import { cn, formatPrice } from "@/lib/utils";
import type { ShopItem } from "@/types";
import Link from "next/link";

interface Props {
  product: ShopItem;
}

export const ShopProductCard = ({ product }: Props) => {
  const productLink = `/${product.parentProductId}/${product.color}`;

  return (
    <Link
      className={cn("h-full w-full cursor-pointer group/main", product.isOutOfStock && "pointer-events-none")}
      href={!product.isOutOfStock ? productLink : ""}
    >
      <Card className="cursor-pointer group h-full flex flex-col relative">
        <div className="relative">
          <ImageSlider urls={product.imgs} />
          {product.isOutOfStock && <ProductOutOfStockState />}
        </div>
        <CardContent className="h-full">
          <div className="grid w-full h-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 gap-2 ">
              <Label className="font-normal">{product.name}</Label>
              <Label className="font-normal">{formatPrice(product.price)} ₽</Label>
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
      <span className="text-error text-xl font-bold uppercase ">распродано</span>
    </div>
  );
};
