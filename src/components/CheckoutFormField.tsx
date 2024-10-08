import { Control } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";
import { CheckoutForm } from "@/lib/checkout-form";

interface CheckoutFormFieldProps {
  control: Control<CheckoutForm>;
  label: string;
  name: "firstName" | "lastName" | "familyName" | "email" | "phone" | "address";
  placeholder?: string | undefined;
}

export const CheckoutFormField: React.FC<CheckoutFormFieldProps> = ({ control, label, name, placeholder = "" }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type="string" {...field} isError={fieldState.error} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
