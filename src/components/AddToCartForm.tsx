"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  Button,
  ConfirmationDialog,
  DelayedSelect,
  Form,
  FormControl,
  FormField,
  FormItem,
  QuantitySelector,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components";
import { useCart, useProductDialog } from "@/hooks";
import { cn, findAllPossibleOffersOfAProduct, findOffer, transformSingleProductData } from "@/lib/utils";
import { PossibleOffer } from "@/types";
import { ProductPreviewData } from "@/types";
import { GetProductsResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  product: ProductPreviewData;
  color: string;
  possibleOffers: PossibleOffer[];
};

const FormSchema = z.object({
  size: z.string().min(1, { message: "Выберите размер" }),
});

const AddToCartForm = ({ product, color }: Props) => {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [currentOffer, setCurrentOffer] = useState<PossibleOffer>();
  type ProductForm = z.infer<typeof FormSchema>;
  const { isDialogOpen, offerToRemove, setIsDialogOpen, prepareProductForDeletion, handleRemoveProduct } =
    useProductDialog();

  type TransformedProductData = {
    dynamicProduct: ProductPreviewData;
    dynamicPossibleOffers: PossibleOffer[];
  };

  const { isLoading, error, data } = useQuery<GetProductsResponse, Error, TransformedProductData>({
    queryKey: [product.parentProductId],
    queryFn: () => fetch(`/api/getProductsByIds?ids=${product.parentProductId}`).then((res) => res.json()),
    select: (data) => {
      const rawProduct = data.products[0];
      return {
        dynamicProduct: transformSingleProductData(rawProduct),
        dynamicPossibleOffers: findAllPossibleOffersOfAProduct(rawProduct),
      };
    },
  });

  const dynamicProduct = data?.dynamicProduct;
  const dynamicPossibleOffers = data?.dynamicPossibleOffers;
  const itemAlreadyInCart = dynamicPossibleOffers && items.some((item) => item.id === dynamicProduct?.parentProductId);
  const isOneSize = !dynamicProduct?.sizes.length;

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

  const handleAddProductToCart = (data: ProductForm) => {
    if (dynamicPossibleOffers) {
      const offer = findOffer(dynamicPossibleOffers, color, data.size, product?.name);
      if (offer) {
        addItem(offer);
        handleToast(offer);
      }
    }
  };

  const form = useForm<ProductForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      size: "",
    },
  });

  const size = useWatch({
    control: form.control,
    name: "size",
  });

  useEffect(() => {
    if (dynamicPossibleOffers) {
      const offer = findOffer(dynamicPossibleOffers, color, size, product?.name);
      offer && setCurrentOffer(offer);
    }
  }, [color, size, dynamicPossibleOffers, product?.name]);

  if (isLoading) {
    return (
      <div className="grid gap-4 mt-4 pointer-events-none">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-4 w-full">
            <Skeleton className="h-12 flex-grow border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium" />
            <Skeleton className="h-12 flex-grow border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium" />
          </div>
          <Skeleton className="h-12 w-full border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium"></Skeleton>
        </div>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddProductToCart)} className="grid gap-4 mt-4">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 w-full">
              {isOneSize ? (
                <div className="h-12 w-full flex-grow max-w-[50%] border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium">
                  один размер
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field, fieldState }) => (
                    <FormItem className="h-12 border border-foreground w-full flex-grow max-w-[50%] flex items-center justify-center font-mono uppercase text-xs font-medium">
                      <DelayedSelect onValueChange={field.onChange} defaultValue={product?.defaultSize}>
                        <FormControl>
                          <SelectTrigger
                            className={cn("focus-visible:border-primary w-full", {
                              "border-error": fieldState.error,
                            })}
                          >
                            <SelectValue placeholder={<p className="text-muted-foreground">Размер</p>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dynamicProduct.sizes.map((size) => (
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
                className="flex-grow max-w-[50%]"
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

  // return (
  //   <>
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(handleAddProductToCart)} className="grid gap-4 mt-4">
  //         <div className="flex flex-col items-center gap-4 w-full">
  //           <div className="flex gap-4 w-full">
  //             <div className="h-12 w-full flex-grow max-w-[50%] border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium">
  //               Size
  //             </div>
  //             <div className="h-12 w-full flex-grow max-w-[50%] border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium">
  //               Quantity
  //             </div>
  //           </div>

  //           <div className="h-12 w-full flex-grow border border-primary flex items-center justify-center font-mono uppercase text-xs font-medium">
  //             submit
  //           </div>
  //         </div>
  //       </form>
  //     </Form>
  //   </>
  // );
};

export { AddToCartForm };
