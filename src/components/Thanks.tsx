"use client";

import { useEffect } from "react";

import { LoadingServisex } from "@/components";
import { useCart } from "@/hooks";
import { useOrderStatus } from "@/hooks";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const Thanks: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  const { data: status } = useOrderStatus(orderId);

  useEffect(() => {
    if (status === "paid") {
      clearCart();
    }
  }, [status, clearCart]);

  if (status === "paid") {
    return <SuccessAfterPayment />;
  }

  if (status === "canceled") {
    return <ErrorAfterPayment />;
  }

  return <LoadingState />;
};

const LoadingState = () => (
  <div className="flex flex-col gap-4 items-center justify-center grow">
    <LoadingServisex />
    <p>Наличие подтверждено, проверяем оплату, никуда не уходите</p>
  </div>
);

const SuccessAfterPayment = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0"
  >
    <p>Спасибо за твой заказ, друг!</p>
    <Link className="underline hover:text-primary" href="/">
      В магазин
    </Link>
  </motion.div>
);

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
