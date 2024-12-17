"use client";

import { LoadingServisex } from "@/components";
import { useIntro } from "@/hooks";
import { transformAllProductsData } from "@/lib/utils";
import { ShopItem } from "@/types";
import { GetProductsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { ShopProductCard } from "./ShopProductCard";

interface ProductsShowcaseProps {
  products: ShopItem[];
}

const ProductsShowcase = ({ products }: ProductsShowcaseProps) => {
  const showAnimation = useIntro();

  const { isLoading, error, data } = useQuery<GetProductsResponse>({
    queryKey: [],
    queryFn: () => fetch("/api/getProducts").then((res) => res.json()),
  });

  const dynamicProducts = data?.products ? transformAllProductsData(data.products).transformedProducts : [];

  const isOutOfStockMap = new Map<string, boolean>();

  dynamicProducts.forEach((dynamicProduct) => {
    const key = `${dynamicProduct.parentProductId}_${dynamicProduct.color || "no-color"}`;
    isOutOfStockMap.set(key, dynamicProduct.isOutOfStock ?? true);
  });

  const mergedProducts = products.map((product) => {
    const key = `${product.parentProductId}_${product.color || "no-color"}`;
    const isOutOfStock = isOutOfStockMap.get(key) ?? true;

    return {
      ...product,
      isOutOfStock,
    };
  });

  if (error) return "An error has occurred: " + (error as Error).message;

  if (isLoading)
    return (
      <div className="justify-center items-center flex grow">
        <LoadingServisex />
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 py-2 px-2 sm:py-0">
      <AnimatePresence>
        {mergedProducts.map((product, index) => (
          <motion.div
            key={product.name}
            initial={showAnimation ? { y: 10, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={showAnimation ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
            exit={showAnimation ? { y: -10, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ShopProductCard key={product.parentProductId} product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { ProductsShowcase };
