import { CardContent, QuantitySelector, Button } from "@/components";
import { CartItem, PossibleOffer } from "@/types";
import { X } from "lucide-react";
import { MouseEvent } from "react";

interface CartProductCardProps {
  product: CartItem;
  prepareProductForDeletion: (offer: PossibleOffer | CartItem) => void;
}

export const CartProductCard = ({ product, prepareProductForDeletion }: CartProductCardProps) => {
  const handleRemoveProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    prepareProductForDeletion(product);
  };

  return (
    <CardContent className="p-0 py-2 sm:p-4">
      <div className="grid gap-2">
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-mono font-medium uppercase">{product.parentProductName}</h3>
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
          </div>
          <QuantitySelector offer={product} prepareProductForDeletion={prepareProductForDeletion} />
        </div>
      </div>
    </CardContent>
  );
};
