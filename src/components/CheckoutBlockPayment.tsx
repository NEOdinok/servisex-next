import { Card, CardContent, Label, RadioGroup, RadioGroupItem } from "@/components";

export const CheckoutBlockPayment = () => {
  return (
    <Card className="border-0 sm:border">
      <p className="text-xxl  text-3xl font-bold w-full items-left sm:px-4 py-4">СПОСОБ ОПЛАТЫ</p>
      <CardContent className="p-0 sm:p-4">
        <RadioGroup defaultValue="russian" className="grid gap-">
          <Label htmlFor="russian" className="flex  items-center gap-2 cursor-pointer ">
            <RadioGroupItem id="russian" value="russian" />
            РОССИЙСКАЯ КАРТА
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
