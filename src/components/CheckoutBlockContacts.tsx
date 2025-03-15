import { Card, CardContent, CheckoutFormField, Separator } from "@/components";
import { CheckoutBlockProps } from "@/types";

export const CheckoutBlockContacts = ({ form }: CheckoutBlockProps) => {
  return (
    <Card className="border-0 sm:border">
      <Separator className="sm:hidden" />
      <p className="text-xxl  text-3xl font-bold w-full items-left sm:px-4 py-4">КОНТАКТНАЯ ИНФОРМАЦИЯ</p>
      <CardContent className="grid gap-2 p-0 sm:p-4">
        <CheckoutFormField control={form.control} name="firstName" label="Имя" placeholder="Ванька" />
        <CheckoutFormField control={form.control} name="lastName" label="Фамилия" placeholder="Иванов" />
        <CheckoutFormField control={form.control} name="familyName" label="Отчество" placeholder="Иванович" />
        <CheckoutFormField control={form.control} name="email" label="Почта" placeholder="servisex@sex.com" />
        <CheckoutFormField control={form.control} name="phone" label="Телефон" placeholder="+6 (666) 666 66-69" />
      </CardContent>
    </Card>
  );
};
