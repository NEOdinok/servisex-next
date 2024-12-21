"use client";

import { useCart } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { LoadingServisex } from "./ui/loading-servisex";

export const Thanks: React.FC = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => fetch(`/api/getOrdersByIds?ids=${orderId}`).then((res) => res.json()),
    enabled: !!orderId, // Prevent the query from running if orderId is undefined
  });

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

  const orderPaid = data?.orders?.[0]?.status === "paid";

  if (orderPaid) clearCart();

  return orderPaid ? <SuccessAfterPayment /> : <ErrorAfterPayment />;
};

// const SuccessAfterPayment = () => (
//   <div className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0">
//     <p>Спасибо за твой заказ друг!</p>
//     <Link className="underline hover:text-primary" href="/shop">
//       В магазин
//     </Link>
//   </div>
// );

const SuccessAfterPayment = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start hidden and 50px below
      animate={{ opacity: 1, y: 0 }} // Animate to visible and 0px
      transition={{ duration: 0.2, ease: "easeOut" }} // Shared transition
      className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0"
    >
      <p>Спасибо за твой заказ друг!</p>
      <Link className="underline hover:text-primary" href="/shop">
        В магазин
      </Link>
    </motion.div>
  );
};

export default SuccessAfterPayment;

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
