import { PossibleOffer } from "@/types";
import { Product, ShopItem } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClient = (): boolean => typeof window !== "undefined";

export const findOffer = (
  possibleOffers: PossibleOffer[],
  color: string | null,
  size: string | null,
  productName: string,
): PossibleOffer | null => {
  // Step 1: Find all offers that match the product name
  const matchingNameOffers = possibleOffers.filter((offer) => offer.name.includes(productName));

  if (matchingNameOffers.length === 0) {
    return null; // No matching name offers
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
  return finalFilteredOffers.length > 0 ? finalFilteredOffers[0] : null;
};

export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const transformAllProductsData = (products: Product[]): { transformedProducts: ShopItem[] } => {
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
