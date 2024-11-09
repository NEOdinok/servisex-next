import { z } from "zod";

export const formSchema = z.object({
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
  address: z.string({
    message: "Для заказа, выберите пункт выдачи СДЭК",
  }),
});

export type CheckoutForm = z.infer<typeof formSchema>;
