"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { cn, findOffer } from "@/lib/utils";
import { useState, useEffect } from "react";
import { PossibleOffer } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Button,
  QuantitySelector,
  DelayedSelect,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  ConfirmationDialog,
} from "@/components";
import { ProductPreviewData } from "@/types";
import { useCart, useProductDialog } from "@/hooks";

type Props = {
  product: ProductPreviewData;
  color: string;
  possibleOffers: PossibleOffer[];
};

const FormSchema = z.object({
  size: z.string().min(1, { message: "Выберите размер" }),
});

const AddToCartForm = ({ product, color, possibleOffers }: Props) => {
  const router = useRouter();
  const { addItem, items } = useCart();
  const isOneSize = !product?.sizes.length;
  const [currentOffer, setCurrentOffer] = useState<PossibleOffer>();
  const itemAlreadyInCart = currentOffer && items.some((item) => item.id === currentOffer?.id);
  type ProductForm = z.infer<typeof FormSchema>;
  const { isDialogOpen, offerToRemove, setIsDialogOpen, prepareProductForDeletion, handleRemoveProduct } =
    useProductDialog();

  const form = useForm<ProductForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      size: product?.defaultSize,
    },
  });

  type MultipleSizeForm = typeof form;

  const handleToast = (product: PossibleOffer) => {
    console.log("toast");
    toast("ТОВАР ДОБАВЛЕН В КОРЗИНУ", {
      description: product.name,
      duration: 2000,
      action: {
        label: "В КОРЗИНУ",
        onClick: () => {
          router.push(`/cart`);
          toast.dismiss();
        },
      },
    });
  };

  const size = useWatch({
    control: form.control,
    name: "size",
  });

  useEffect(() => {
    const offer = findOffer(possibleOffers, color, size, product?.name);
    offer && setCurrentOffer(offer);
  }, [color, size, possibleOffers, product?.name]);

  const handleAddProductToCart = (data: ProductForm) => {
    const offer = findOffer(possibleOffers, color, data.size, product?.name);
    if (offer) {
      addItem(offer);
      handleToast(offer);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddProductToCart)} className="grid gap-4 mt-4">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 w-full">
              {isOneSize ? (
                <div className="h-12 w-full border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium">
                  один размер
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full max-w-[50%]">
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
                                className={cn("uppercase font-mono w-full", {
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
              <QuantitySelector
                offer={currentOffer}
                prepareProductForDeletion={prepareProductForDeletion}
                className="w-full max-w-[50%]"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-foreground"
              variant="outline"
              size="lg"
              disabled={itemAlreadyInCart}
            >
              {itemAlreadyInCart ? "УЖЕ В КОРЗИНЕ" : "ДОБАВИТЬ В КОРЗИНУ"}
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmationDialog
        productToRemove={offerToRemove}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        handleRemoveProduct={handleRemoveProduct}
      />
    </>
  );
};

export { AddToCartForm };
