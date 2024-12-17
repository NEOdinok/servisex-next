"use client";

import { LoadingServisex } from "@/components";
import { BaseLayout } from "@/layouts/BaseLayout";
import { GetOrdersResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const ThanksPage = () => {
  const urlParameterOrderId = "123";

  const { isLoading, error, data } = useQuery<GetOrdersResponse, Error>({
    queryKey: [urlParameterOrderId],
    queryFn: () => fetch(`/api/getOrdersByIds?ids=${urlParameterOrderId}`).then((res) => res.json()),
  });

  const orderPaid = data?.orders[0].status === "paid";

  if (error) {
    <div className="justify-center items-center flex grow">
      <p>Error</p>
    </div>;
  }

  if (isLoading)
    return (
      <div className="justify-center items-center flex grow">
        <LoadingServisex />
      </div>
    );

  return <BaseLayout>{orderPaid ? <SuccessAfterPayment /> : <ErrorAfterPayment />}</BaseLayout>;
};

const SuccessAfterPayment = () => {
  return (
    <div className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0">
      <p>Спасибо за твой заказ друг!</p>
      <Link href="/shop">В магазин</Link>
    </div>
  );
};

const ErrorAfterPayment = () => {
  return (
    <div className="flex grow items-center justify-center gap-2 sm:gap-4 py-2 px-2 sm:py-0">
      <p>Что-то не так с оформлением :(</p>
      <p>
        Попробуйте<Link href="/"> оформить</Link>снова
      </p>
    </div>
  );
};

export default ThanksPage;
