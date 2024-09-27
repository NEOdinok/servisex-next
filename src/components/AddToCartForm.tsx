"use client";
import { z } from "zod";
import { FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { cn, findOffer } from "@/lib/utils";
import { useState, useEffect } from "react";
import { PossibleOffer } from "@/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Button,
  DelayedSelect,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components";
import { Product, ProductPreviewData } from "@/types";
// AmountSelector

type Props = {
  product: ProductPreviewData;
  color: string;
  possibleOffers: PossibleOffer[];
};

const FormSchema = z.object({
  size: z.string().min(1, { message: "Выберите размер" }),
});

const AddToCartForm = ({ product, color, possibleOffers }: Props) => {
  type ProductForm = z.infer<typeof FormSchema>;
  const isOneSize = !product?.sizes.length;
  const [currentOffer, setCurrentOffer] = useState<PossibleOffer | undefined>();

  const form = useForm<ProductForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      size: product?.defaultSize,
    },
  });

  type MultipleSizeForm = typeof form;

  const size = useWatch({
    control: form.control,
    name: "size",
  });

  useEffect(() => {
    const offer = findOffer(possibleOffers, color, size, product?.name);
    offer && setCurrentOffer(offer);
    console.log("[useEffect] looking for color:", color, "size:", size, "name:", product?.name);
    console.log("[useEffect] set new offer", offer);
  }, [color, size, possibleOffers, product?.name]);

  const handleAddProductToCart = () => {
    console.log("add to cart");
  };

  const handleSubmitOneSizeForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddProductToCart();
  };

  const handleSubmitMultipleSizedForm = (form: MultipleSizeForm) => {
    form.handleSubmit(handleAddProductToCart);
  };

  return (
    <>
      {isOneSize ? (
        <form
          onSubmit={(e) => {
            handleSubmitOneSizeForm(e);
          }}
          className="grid gap-4 mt-4"
        >
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 w-full">
              <div className="h-12 w-full border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium">
                один размер
              </div>
              <p className="uppercase">Amount selector</p>
              {/* <AmountSelector
                offer={currentOffer}
                prepareProductForDeletion={prepareProductForDeletion}
                className="w-full"
              /> */}
            </div>

            <Button type="submit" className="w-full text-foreground" variant="outline" size="lg" disabled={false}>
              {/* {isItemInCart ? "УЖЕ В КОРЗИНЕ" : "ДОБАВИТЬ В КОРЗИНУ"} */}
              {"ТЕКСТ КНОПКИ"}
            </Button>
          </div>
        </form>
      ) : (
        <Form {...form}>
          <form onSubmit={() => handleSubmitMultipleSizedForm(form)} className="grid gap-4 mt-4">
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex gap-4 w-full">
                {product?.sizes.length && (
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full">
                        <DelayedSelect onValueChange={field.onChange} defaultValue={product?.defaultSize}>
                          <FormControl>
                            <SelectTrigger
                              className={cn("border-foreground focus-visible:border-primary", {
                                "border-error": fieldState.error,
                              })}
                            >
                              <SelectValue placeholder={<p className="text-muted-foreground">Размер</p>} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {product.sizes.map((size) => (
                              <SelectItem key={size.value} value={size.value} disabled={!size.quantity}>
                                <span
                                  className={cn(" uppercase font-mono w-full", {
                                    "text-error pointer-events-none": !size.quantity,
                                  })}
                                >
                                  {!size.quantity ? (
                                    <span className="font-mono text-error uppercase">{size.value} - Распродано</span>
                                  ) : (
                                    <span>{size.value}</span>
                                  )}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </DelayedSelect>
                      </FormItem>
                    )}
                  />
                )}
                <p className="uppercase">Amount selector</p>
                {/* <AmountSelector
                  offer={currentOffer}
                  prepareProductForDeletion={prepareProductForDeletion}
                  className="w-full"
                /> */}
              </div>
              <Button type="submit" className="w-full text-foreground" variant="outline" size="lg" disabled={false}>
                {/* {isItemInCart ? "УЖЕ В КОРЗИНЕ" : "ДОБАВИТЬ В КОРЗИНУ"} */}
                {"ТЕКСТ КНОПКИ"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export { AddToCartForm };
