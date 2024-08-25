import { Card, CardContent, Label } from "@/components/ui";
import type { ShopItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  product: ShopItem;
  animationIndex: number;
}

export const ShopCard = ({ product, animationIndex }: Props) => {
  const showAnimation = true;

  return (
    <motion.div
      key={product.name}
      initial={showAnimation ? { y: 10, opacity: 0 } : {}}
      animate={showAnimation ? { y: 0, opacity: 1 } : {}}
      exit={showAnimation ? { y: -10, opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: animationIndex * 0.1 }}
    >
      <Card
        className={`cursor-pointer group h-full flex flex-col relative ${
          product.isOutOfStock ? "pointer-events-none" : ""
        }`}
      >
        <div className="relative">
          <Image
            src={product.imgs[0]}
            alt={product.name}
            className={`w-full h-auto ${
              product.isOutOfStock
                ? "opacity-50"
                : "group-hover:opacity-70 group-hover:border-2 group-hover:border-primary"
            }`}
          />
          {product.isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-error text-xl font-bold uppercase font-mono">распродано</span>
            </div>
          )}
        </div>
        <CardContent className="h-full">
          <div className="grid w-full h-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 gap-2 font-mono">
              <Label className="font-mono font-normal">{product.name}</Label>
              <Label className="font-mono font-normal">{product.price} ₽</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
