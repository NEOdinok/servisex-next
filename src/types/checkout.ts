import { UseFormReturn } from "react-hook-form";

import { CheckoutForm } from "@/lib/checkout-form";

export type CheckoutBlockProps = {
  form: UseFormReturn<CheckoutForm>;
};
