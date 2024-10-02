"use client";

import { PossibleOffer, CartItem } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components";
import { PlusIcon, MinusIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks";

/** TODO:
 * is this ok or not: offer: PossibleOffer | CartItem;
 */
interface QuantitySelectorProps {
  className?: string | undefined;
  offer: PossibleOffer | CartItem | undefined;
  prepareProductForDeletion: (offer: PossibleOffer | CartItem) => void;
}

export const QuantitySelector = ({ offer, prepareProductForDeletion, className }: QuantitySelectorProps) => {
  const rootStyle = "inline-flex w-full h-12 tems-center justify-between font-mono border border-foreground";
  const classList = cn(rootStyle, className);
  const { addItem, removeItem, incrementItemQuantity, decrementItemQuantity, items } = useCart();
  const router = useRouter();
  const itemQuantity = (offer && items.find((item) => item.id === offer?.id)?.quantity) || 0;
  const itemAlreadyInCart = offer && items.find((item) => item.id === offer?.id);

  if (!offer) return <div className={classList}></div>;

  const handleToast = (product: PossibleOffer) => {
    console.log("toast");
    toast("ТОВАР ДОБАВЛЕН В КОРЗИНУ", {
      description: product.name,
      duration: 2000,
      action: {
        label: "В КОРЗИНУ",
        onClick: () => {
          router.push(`/cart`);
          toast.dismiss();
        },
      },
    });
  };

  const handleIncrement = () => {
    if (itemAlreadyInCart) {
      incrementItemQuantity(offer.id);
    } else {
      addItem(offer);
      handleToast(offer);
    }
  };

  const handleDecrement = () => {
    if (itemAlreadyInCart && itemQuantity === 1) {
      prepareProductForDeletion(offer);
    } else if (itemAlreadyInCart) {
      decrementItemQuantity(offer.id);
    } else return;
  };

  return (
    <div className={classList}>
      <Button variant="ghost" className="h-full aspect-square p-0" onClick={handleDecrement}>
        <MinusIcon className="w-5 h-5" />
      </Button>

      <div className="flex items-center font-mono justify-center w-12 text-center">{itemQuantity}</div>

      <Button variant="ghost" className="h-full aspect-square p-0" onClick={handleIncrement}>
        <PlusIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};
