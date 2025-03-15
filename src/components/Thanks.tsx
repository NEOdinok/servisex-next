"use client";

import { useEffect } from "react";

import { LoadingServisex } from "@/components";
import { useCart } from "@/hooks";
import { GetOrdersResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const Thanks: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  const { isLoading, error, data } = useQuery<GetOrdersResponse>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/getOrdersByIds?ids=${orderId}`);
      return res.json() as Promise<GetOrdersResponse>;
    },
    enabled: !!orderId,
  });

  const orderPaid = data?.orders?.[0]?.status === "paid";

  useEffect(() => {
    if (orderPaid) {
      clearCart();
    }
  }, [orderPaid, clearCart]);

  if (error)
    return (
      <div className="flex justify-center items-center grow">
        <p>Error loading order</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex justify-center items-center grow">
        <LoadingServisex />
      </div>
    );

  return orderPaid ? <SuccessAfterPayment /> : <ErrorAfterPayment />;
};

const SuccessAfterPayment = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start hidden and 50px below
      animate={{ opacity: 1, y: 0 }} // Animate to visible and 0px
      transition={{ duration: 0.2, ease: "easeOut" }} // Shared transition
      className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0"
    >
      <p>Спасибо за твой заказ друг!</p>
      <Link className="underline hover:text-primary" href="/">
        В магазин
      </Link>
    </motion.div>
  );
};

const ErrorAfterPayment = () => (
  <div className="flex flex-col grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0">
    <p>Что-то не так с оформлением :(</p>
    <p>
      Попробуйте{" "}
      <Link className="underline hover:text-primary" href="/cart">
        оформить
      </Link>{" "}
      снова
    </p>
  </div>
);
