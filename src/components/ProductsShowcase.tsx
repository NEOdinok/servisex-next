"use client";

import { transformAllProductsData } from "@/lib/utils";
import { ShopItem } from "@/types";
import { GetProductsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { ShopProductCard } from "./ShopProductCard";

interface ProductsShowcaseProps {
  products: ShopItem[];
}

const ProductsShowcase = ({ products }: ProductsShowcaseProps) => {
  const showAnimation = true;
  const router = useRouter();

  const { isLoading, error, data } = useQuery<GetProductsResponse>({
    queryKey: [],
    queryFn: () => fetch("/api/getProducts").then((res) => res.json()),
  });

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + (error as Error).message;

  // Only transform data when it's available and avoid 'undefined' errors
  const dynamicProducts = data?.products ? transformAllProductsData(data.products).transformedProducts : [];

  // Create a map of parentProductId and color to isOutOfStock status
  const isOutOfStockMap = new Map<string, boolean>();

  dynamicProducts.forEach((dynamicProduct) => {
    const key = `${dynamicProduct.parentProductId}_${dynamicProduct.color || "no-color"}`;
    isOutOfStockMap.set(key, dynamicProduct.isOutOfStock ?? true);

    console.log("dynamic", key, "isOutOfStock:", dynamicProduct.isOutOfStock ?? true);
  });

  // Merge static products with dynamic isOutOfStock status
  const mergedProducts = products.map((product) => {
    const key = `${product.parentProductId}_${product.color || "no-color"}`;
    // Ensure isOutOfStock is always a boolean by defaulting to true (or false based on your logic)
    const isOutOfStock = isOutOfStockMap.get(key) ?? true;

    console.log("merged", key, "isOutOfStock:", product.isOutOfStock ?? true);

    return {
      ...product,
      isOutOfStock, // Now guaranteed to be a boolean
    };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 py-2 px-2 sm:py-0">
      <AnimatePresence>
        {mergedProducts.map((product, index) => (
          <motion.div
            key={product.name}
            initial={showAnimation ? { y: 10, opacity: 0 } : {}}
            animate={showAnimation ? { y: 0, opacity: 1 } : {}}
            exit={showAnimation ? { y: -10, opacity: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ShopProductCard
              key={product.parentProductId}
              product={product}
              onClick={() => router.push(`/shop/${product.parentProductId}/${product.color}`)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { ProductsShowcase };
