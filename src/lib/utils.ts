import { PossibleOffer, TelegramOrderDetails } from "@/types";
import { Product, ProductPreviewData, ShopItem } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClient = (): boolean => typeof window !== "undefined";

export const findOffer = (
  possibleOffers: PossibleOffer[],
  color: string | null | undefined,
  size: string | null | undefined,
  productName: string,
): PossibleOffer | undefined => {
  // Step 1: Find all offers that match the product name
  const matchingNameOffers = possibleOffers.filter((offer) => offer.name.includes(productName));

  if (matchingNameOffers.length === 0) {
    return undefined; // No matching name offers
  }

  // Step 2: If size is not "one-size", filter by matching size
  let filteredBySizeOffers = matchingNameOffers;
  if (size && size !== "one-size") {
    filteredBySizeOffers = matchingNameOffers.filter((offer) => offer.properties?.size === size);
  }

  // Step 3: If color is not "one-color", filter by matching color
  let finalFilteredOffers = filteredBySizeOffers;
  if (color && color !== "one-color") {
    finalFilteredOffers = filteredBySizeOffers.filter((offer) => offer.properties?.color === color);
  }

  // Return the first matching offer or null if no match is found
  return finalFilteredOffers.length > 0 ? finalFilteredOffers[0] : undefined;
};

export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const transformAllProductsData = (products: Product[]): { transformedProducts: ShopItem[] } => {
  const transformedProducts: ShopItem[] = [];

  products.forEach((product) => {
    if (!product.manufacturer || product.manufacturer !== "SERVISEX") {
      return;
    }

    if (!product.active) {
      return;
    }

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
            color: color || "one-color",
          };
        } else {
          noColorProduct.isOutOfStock = noColorProduct.isOutOfStock && offer.quantity === 0;

          // Add unique images
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

export const transformSingleProductData = (product: Product, color?: string): ProductPreviewData => {
  if (!product.manufacturer || product.manufacturer !== "SERVISEX") {
    return {
      name: "",
      imgs: [],
      parentProductId: product.id,
      price: 0,
      description: "",
      sizes: [],
      defaultSize: "one-size",
    };
  }

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
          return { value: value.value, quantity, isDefault: value.default };
        }) || []
    : [];

  /**
   * This one sets first size with quantity > 0 as a defaut one.
   * Setting real default is complicated because we run into the problem
   * of setting it in select even though it being out of stock.
   */
  const defaultSize = sizes.find((size) => size.quantity)?.value || "one-size";

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

export const findAllPossibleOffersOfAProduct = (product: Product): PossibleOffer[] =>
  product.offers.map((offer) => ({
    isOutOfStock: offer.quantity === 0 ? true : false,
    parentProductName: product.name,
    parentProductId: product.id,
    availableQuantity: offer.quantity,
    name: offer.name,
    price: offer.price,
    images: offer.images || [],
    id: offer.id,
    properties: {
      color: offer.properties?.color || "one-color",
      size: offer.properties?.size || "one-size",
    },
  }));

export const sendOrderDetailsToTelegram = async (
  values: TelegramOrderDetails,
  status: "created" | "paid", // Accepts two statuses: "created" or "paid"
) => {
  console.log(`Sending ${status} order to Telegram`);

  try {
    const statusMessage = status === "created" ? "Заказ создан" : "Заказ оплачен";

    const message = encodeURIComponent(`
      ${statusMessage} ✅

      👤 Получатель:
      Имя: ${values.name}
      Почта: ${values.email}
      Телефон: ${values.phone}

      🚚 Доставка:
      Способ получения: ${values.delivery}
      Адрес доставки: ${values.address}
      Комментарий: ${values.customerComment}

      💰 Деньги:
      Стоимость товаров: ${values.productsPrice}
      Стоимость доставки: ${values.deliveryPrice}
      Всего: ${values.totalPrice}
      `);

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.NEXT_PUBLIC_TELEGRAM_ORDER_CHAT_ID}&parse_mode=html&text=${message}`,
    );

    const data = await response.json();

    console.log("Data is sent successfully");

    if (!data.ok) {
      console.warn("Failed to send message:", data.description);
    }
  } catch (error) {
    console.warn("Error sending order to Telegram:", error);
  }
};
