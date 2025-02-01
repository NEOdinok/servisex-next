"use client";

import { Card, CartProductCard, ConfirmationDialog } from "@/components";
import { useProductDialog } from "@/hooks";
import { useCart, useStore } from "@/hooks";

export const CheckoutBlockCart: React.FC = () => {
  const { isDialogOpen, setIsDialogOpen, offerToRemove, prepareProductForDeletion, handleRemoveProduct } =
    useProductDialog();

  // Previously it was like this:
  // const { items, hasHydrated } = useCart();
  //
  // This Zustand way of hook inside hook looks horrible
  // This is only used here for hasHydrated to work
  const items = useStore(useCart, (state) => state.items);
  const hasHydrated = useStore(useCart, (state) => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <Card className="border-0 sm:border">
        <p className="text-xxl  text-3xl font-bold w-full items-left sm:px-4 py-4">КОРЗИНА</p>
      </Card>
    );
  }

  return (
    <Card className="border-0 sm:border">
      <p className="text-xxl  text-3xl font-bold w-full items-left sm:px-4 py-4">КОРЗИНА</p>

      <>
        {items?.length ? (
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

const CartEmptyState = () => (
  <p className="text-base  leading-none w-full items-left sm:px-4 sm:py-4 text-muted-foreground">Тут пока пусто...</p>
);
