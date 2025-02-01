export interface ProductGroup {
  id: number;
}

export interface OptionValue {
  value: string;
  default: boolean;
}

export interface Option {
  code: string;
  values: OptionValue[];
}

export interface OfferPrice {
  priceType: string;
  price: number;
  ordering: number;
  currency: string;
}

export interface Offer {
  name: string;
  price: number;
  images: string[];
  id: number;
  prices: OfferPrice[];
  purchasePrice: number;
  vatRate: string;
  properties: { [key: string]: string };
  quantity: number;
  active: boolean;
}

export interface Pagination {
  limit: number;
  totalCount: number;
  currentPage: number;
  totalPageCount: number;
}

export interface Product {
  type: string;
  minPrice: number;
  maxPrice: number;
  catalogId: number;
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  popular: boolean;
  stock: boolean;
  novelty: boolean;
  recommended: boolean;
  options?: Option[];
  groups: ProductGroup[];
  manufacturer: string;
  offers: Offer[];
  updatedAt: string;
  active: boolean;
  quantity: number;
  markable: boolean;
}

export interface GetProductsResponse {
  success: boolean;
  pagination: Pagination;
  products: Product[];
}

export interface ProductPreviewData {
  name: string;
  imgs: string[];
  parentProductId: number;
  price: number;
  description: string;
  color?: string;
  sizes: Array<{
    value: string;
    quantity: number;
  }>;
  defaultSize: string;
}

export interface PossibleOffer {
  isOutOfStock: boolean;
  parentProductName: string;
  parentProductId: number;
  availableQuantity: number;
  name: string;
  price: number;
  images: string[];
  id: number;
  properties: {
    color?: string;
    size?: string;
  };
}

export interface ShopItem {
  name: string;
  imgs: string[];
  parentProductId: number;
  isOutOfStock: boolean;
  price: number;
  description: string;
  color?: string;
}

export interface TransformedProductData {
  dynamicProduct: ProductPreviewData;
  dynamicPossibleOffers: PossibleOffer[];
}

export type Manufacturer = "SERVISEX" | "GOAT.CORP";
