"use client";

import { useCart } from "@/hooks";

export const HeaderCartCounter = () => {
  const { items } = useCart();
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return <>{`КОРЗИНА(${totalQuantity})`}</>;
};
