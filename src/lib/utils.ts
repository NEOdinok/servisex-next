import { PossibleOffer } from "@/types";
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
