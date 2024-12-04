"use client";

import { MouseEvent, useEffect, useState } from "react";

import { Skeleton } from "@/components";
import { Button, CardContent, QuantitySelector } from "@/components";
import { useCart } from "@/hooks";
import { findAllPossibleOffersOfAProduct, formatPrice, transformSingleProductData } from "@/lib/utils";
import { GetProductsResponse, TransformedProductData } from "@/types";
import { CartItem, PossibleOffer } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartProductCardProps {
  product: CartItem;
  prepareProductForDeletion: (offer: PossibleOffer | CartItem) => void;
}

export const CartProductCard: React.FC<CartProductCardProps> = ({ product, prepareProductForDeletion }) => {
  const { incrementItemQuantity, decrementItemQuantity, items } = useCart();
  const [currentOffer, setCurrentOffer] = useState<PossibleOffer | undefined>(undefined);

  const handleRemoveProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    prepareProductForDeletion(product);
  };

  const { isLoading, error, data } = useQuery<GetProductsResponse, Error, TransformedProductData>({
    queryKey: [product.parentProductId],
    queryFn: () => fetch(`/api/getProductsByIds?ids=${product.parentProductId}`).then((res) => res.json()),
    select: (data) => {
      const rawProduct = data.products[0];
      const dynamicProduct = transformSingleProductData(rawProduct);
      const dynamicPossibleOffers = findAllPossibleOffersOfAProduct(rawProduct);
      return {
        dynamicProduct,
        dynamicPossibleOffers,
      };
    },
  });

  const dynamicPossibleOffers = data?.dynamicPossibleOffers;

  useEffect(() => {
    if (dynamicPossibleOffers) {
      const offer = dynamicPossibleOffers.find((offer) => offer.id === product.id);
      offer && setCurrentOffer(offer);
    }
  }, [dynamicPossibleOffers, product.id]);

  const handleIncrement = () => {
    if (!currentOffer) return;

    if (product.quantity < (currentOffer.availableQuantity || Infinity)) {
      incrementItemQuantity(currentOffer.id);
    }
  };

  const handleDecrement = () => {
    if (!currentOffer) return;

    if (product.quantity > 1) {
      decrementItemQuantity(currentOffer.id);
    } else if (product.quantity === 1) {
      prepareProductForDeletion(product);
    }
  };

  const maxValue = currentOffer?.availableQuantity || Infinity;

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (isLoading || !currentOffer) {
    return <CartProductCardSkeleton />;
  }
  return (
    <CardContent className="p-0 py-2 sm:p-4">
      <div className="grid gap-2 cursor-pointer">
        <div className="flex justify-between items-center gap-2">
          <ProductShopLink product={product} />
          <Button variant="ghost" size="icon" onClick={(e) => handleRemoveProduct(e)}>
            <X />
          </Button>
        </div>
        <div className="grid grid-cols-[64px_1fr_auto] items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt="Product template"
            width={64}
            height={64}
            className="object-cover aspect-square"
          />
          <div>
            <p className="font-mono text-xs md:text-sm text-muted-foreground ">
              Цвет: {product.properties?.color ? <>{product.properties?.color} </> : <>Один цвет</>}
            </p>
            <p className="font-mono text-xs md:text-sm text-muted-foreground ">
              Размер: {product.properties?.size ? <>{product.properties?.size}</> : <>Один размер</>}
            </p>
            <p className="font-mono text-xs md:text-sm text-muted-foreground ">Цена: {formatPrice(product.price)} ₽</p>
          </div>
          <QuantitySelector
            value={product.quantity}
            maxValue={maxValue}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </div>
      </div>
    </CardContent>
  );
};

interface ProductShopLinkProps {
  product: CartItem;
}

const ProductShopLink: React.FC<ProductShopLinkProps> = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop/${product.parentProductId}/${product.properties.color || "one-color"}`);
  };

  return (
    <h3 className="font-mono font-medium uppercase hover:underline" onClick={handleClick}>
      {product.parentProductName}
    </h3>
  );
};

export const CartProductCardSkeleton: React.FC = () => {
  return (
    <CardContent className="h-[140px] p-0 sm:p-4">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="w-full h-6" />
        <Skeleton className="rounded-full h-9 aspect-square ml-12" />
      </div>

      <div className="grid grid-cols-[64px_1fr] items-center gap-4">
        <Skeleton className="h-16 w-16" />
        <div className="w-full flex justify-between flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </CardContent>
  );
};
