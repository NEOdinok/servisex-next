"use client";

import { useCart } from "@/hooks";
import Link from "next/link";

export const HeaderCartCounter = () => {
  const { items } = useCart();
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="uppercase text-primary hover:cursor-pointer hover:underline hover:text-primary sm:text-foreground text-2xl sm:text-base"
    >
      {`КОРЗИНА(${totalQuantity})`}
    </Link>
  );
};
