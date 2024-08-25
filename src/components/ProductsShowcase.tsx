"use client";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { ShopCard } from "./ShopCard";
import { ShopItem } from "@/types";

interface ProductsShowcaseProps {
  products: ShopItem[];
}

const ProductsShowcase = ({ products }: ProductsShowcaseProps) => {
  const showAnimation = true;

  return (
    <AnimatePresence>
      {products.map((product, index) => (
        <motion.div
          key={product.name}
          initial={showAnimation ? { y: 10, opacity: 0 } : {}}
          animate={showAnimation ? { y: 0, opacity: 1 } : {}}
          exit={showAnimation ? { y: -10, opacity: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <ShopCard key={product.parentProductId} product={product} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export { ProductsShowcase };
