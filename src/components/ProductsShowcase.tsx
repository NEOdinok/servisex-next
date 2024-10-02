"use client";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ShopProductCard } from "./ShopProductCard";
import { ShopItem } from "@/types";
import { useRouter } from "next/navigation";

interface ProductsShowcaseProps {
  products: ShopItem[];
}

const ProductsShowcase = ({ products }: ProductsShowcaseProps) => {
  const showAnimation = false;
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 py-2 px-2 sm:py-0">
      <AnimatePresence>
        {products.map((product, index) => (
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
