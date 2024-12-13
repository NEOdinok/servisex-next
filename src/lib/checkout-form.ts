import { z } from "zod";

const checkoutSchema = z.object({
  firstName: z.string().min(2, {
    message: "Имя должно быть более 2 символов",
  }),
  lastName: z.string().min(2, {
    message: "Фамилия должна быть более 2 символов",
  }),
  familyName: z.string().optional(),
  email: z
    .string()
    .min(2, {
      message: "Email должен быть длиннее 2 символов",
    })
    .email({
      message: "Введите корректный email",
    }),
  phone: z
    .string({
      message: "Введите номер",
    })
    .min(2, {
      message: "[Строка] Номер не может быть таким коротким",
    }),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  deliveryTariff: z.string().optional(),
  address: z.string().optional(),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;

function validateAddressForDelivery(data: CheckoutForm): boolean {
  if (data.deliveryMethod === "delivery") {
    return !!data.address && data.address.trim() !== "";
  }
  return true;
}

export const formSchema = checkoutSchema.refine(validateAddressForDelivery, {
  message: "Для заказа, выберите пункт выдачи СДЭК",
  path: ["address"],
});
