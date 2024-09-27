import { BaseLayout } from "@/layouts";
import { ShopItem, GetProductsResponse, Product, ProductPreviewData } from "@/types";

import { Gallery, BaseCarousel, InfoBlock } from "@/components";

interface ProductPageProps {
  params: {
    parentProductId: string;
    color: string;
  };
}

export const dynamicParams = false;

const transformAllProductsData = (products: Product[]): { transformedProducts: ShopItem[] } => {
  const transformedProducts: ShopItem[] = [];

  products.forEach((product) => {
    const colorMap: { [key: string]: ShopItem } = {};
    let noColorProduct: ShopItem | null = null;

    product.offers.forEach((offer) => {
      const color = offer.properties?.color;

      if (!color) {
        if (!noColorProduct) {
          noColorProduct = {
            name: product.name,
            imgs: [...offer.images],
            parentProductId: product.id,
            price: product.minPrice,
            isOutOfStock: offer.quantity === 0,
            description: product.description,
            color: color || "one-color", // Fallback value
          };
        } else {
          noColorProduct.isOutOfStock = noColorProduct.isOutOfStock && offer.quantity === 0;

          // Manually add unique images to the array
          offer.images.forEach((img) => {
            if (!noColorProduct!.imgs.includes(img)) {
              noColorProduct!.imgs.push(img);
            }
          });
        }
      } else {
        if (!colorMap[color]) {
          colorMap[color] = {
            name: `${product.name} ${color}`,
            imgs: [...offer.images],
            parentProductId: product.id,
            price: offer.price,
            isOutOfStock: true,
            description: product.description,
            color: color,
          };
        }

        if (offer.quantity > 0) {
          colorMap[color].isOutOfStock = false;
        }
      }
    });

    if (noColorProduct) {
      transformedProducts.push(noColorProduct);
    }

    Object.values(colorMap).forEach((colorProduct) => {
      transformedProducts.push(colorProduct);
    });
  });

  return { transformedProducts };
};

const transformProductData = (product: Product, color?: string): ProductPreviewData => {
  // Determine if the product has color and size options
  const hasColorOption = product.options?.some((option) => option.code === "color");
  const hasSizeOption = product.options?.some((option) => option.code === "size");

  // Filter offers based on color if the product has both color and size options and a color is specified
  const filteredOffers =
    hasColorOption && hasSizeOption && color && color !== "one-color"
      ? product.offers.filter((offer) => offer.properties?.color === color)
      : product.offers;

  // Build sizes array if the product has size options
  const sizes = hasSizeOption
    ? product.options
        ?.find((option) => option.code === "size")
        ?.values.map((value) => {
          const quantity = filteredOffers
            .filter((offer) => offer.properties?.size === value.value)
            .reduce((sum, offer) => sum + (offer.quantity || 0), 0);
          return { value: value.value, quantity };
        }) || []
    : [];

  // Find the first available size
  const defaultSize = sizes.find((size) => size.quantity > 0)?.value || "";

  // Build images
  let imgs: string[] = [];

  if (hasColorOption && hasSizeOption && color && color !== "one-color") {
    // Product has both color and size options, and color is specified (but not "one-color")
    // Take images from the first offer with matching color
    const matchingOffer = product.offers.find((offer) => offer.properties?.color === color);
    if (matchingOffer) {
      imgs = matchingOffer.images || [];
    } else {
      // No matching offer, take images from the first offer
      imgs = product.offers[0]?.images || [];
    }
  } else {
    // In all other cases (including "one-color"), take images from the first offer only
    imgs = product.offers[0]?.images || [];
  }

  return {
    name: product.name,
    imgs,
    parentProductId: product.id,
    price: product.minPrice,
    description: product.description,
    color,
    sizes,
    defaultSize,
  };
};

const fetchProducts = async (): Promise<ShopItem[]> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(`${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: GetProductsResponse = await response.json();
  const { transformedProducts } = transformAllProductsData(data.products);
  return transformedProducts;
};

const fetchSingleProduct = async (parentProductId: string, color?: string): Promise<ProductPreviewData> => {
  const API_ENDPOINT = "https://goshamartynovich.retailcrm.ru/api/v5/store/products";
  const response = await fetch(
    `${API_ENDPOINT}?apiKey=${process.env.NEXT_PUBLIC_RETAIL_CRM_API}&filter[ids][]=${parentProductId}`,
    {
      cache: "force-cache",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: GetProductsResponse = await response.json();
  const product = data.products[0]; // sinse we are expecting single product

  const productPreviewData = transformProductData(product, color);
  return productPreviewData;
};

// Generate static paths based on fetched products
export async function generateStaticParams() {
  const products = await fetchProducts();

  return products.map((product) => ({
    parentProductId: product.parentProductId.toString(),
    color: product.color ? product.color : "no-color",
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { parentProductId, color } = params;

  const product = await fetchSingleProduct(parentProductId, color);

  return (
    <BaseLayout>
      <>
        <div className="grid sm:grid-cols-[400px_1fr] gap-8 sm:px-4">
          <div className="flex items-center flex-col h-fit gap-4">
            <Gallery
              imageUrls={product?.imgs}
              productName={product.name}
              className="hidden sm:flex sm:flex-col md:grid md:grid-cols-2 gap-4"
            />
            <BaseCarousel
              imageUrls={product.imgs}
              productName={product.name}
              className="block sm:hidden w-full aspect-[1/1]"
            />
          </div>

          <div className="flex px-2 sm:px-0 flex-col sm:order-first mb-16">
            <div className="flex flex-col gap-8">
              <h1 className="text-3xl font-mono font-bold uppercase">{product?.name}</h1>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono uppercase">{product.price} ₽</span>
              </div>
            </div>

            <div className="grid gap-4 mt-8 text-xs leading-loose">
              <InfoBlock title="описание" content={<span className="font-mono">{product?.description}</span>} />
            </div>

            {/* {productsData?.sizes.length ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddProductToCart)} className="grid gap-4 mt-4">
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex gap-4 w-full">
                      {productsData?.sizes.length && (
                        <FormField
                          control={form.control}
                          name="size"
                          render={({ field, fieldState }) => (
                            <FormItem className="w-full">
                              <DelayedSelect onValueChange={field.onChange} defaultValue={productsData?.defaultSize}>
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
                                  {productsData.sizes.map((size) => (
                                    <SelectItem key={size.value} value={size.value} disabled={!size.quantity}>
                                      <span
                                        className={cn(" uppercase font-mono w-full", {
                                          "text-error pointer-events-none": !size.quantity,
                                        })}
                                      >
                                        {!size.quantity ? (
                                          <span className="font-mono text-error uppercase">
                                            {size.value} - Распродано
                                          </span>
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
                      <AmountSelector
                        offer={currentOffer}
                        prepareProductForDeletion={prepareProductForDeletion}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full text-foreground"
                      variant="outline"
                      size="lg"
                      disabled={isItemInCart}
                    >
                      {isItemInCart ? "УЖЕ В КОРЗИНЕ" : "ДОБАВИТЬ В КОРЗИНУ"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddProductToCart({ size: "" });
                }}
                className="grid gap-4 mt-4"
              >
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex gap-4 w-full">
                    <div className="h-12 w-full border border-foreground flex items-center justify-center font-mono uppercase text-xs font-medium">
                      один размер
                    </div>
                    <AmountSelector
                      offer={currentOffer}
                      prepareProductForDeletion={prepareProductForDeletion}
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-foreground"
                    variant="outline"
                    size="lg"
                    disabled={isItemInCart}
                  >
                    {isItemInCart ? "УЖЕ В КОРЗИНЕ" : "ДОБАВИТЬ В КОРЗИНУ"}
                  </Button>
                </div>
              </form>
            )} */}
          </div>
        </div>

        {/* <ConfirmationDialog
          productToRemove={offerToRemove}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          handleRemoveProduct={handleRemoveProduct}
        /> */}
      </>
    </BaseLayout>
  );
}
