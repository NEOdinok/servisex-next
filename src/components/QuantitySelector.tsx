"use client";

import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

/** TODO:
 * is this ok or not: offer: PossibleOffer | CartItem;
 */

interface QuantitySelectorProps {
  className?: string;
  value: number;
  maxValue?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantitySelector = ({
  className,
  value,
  maxValue = Infinity,
  onIncrement,
  onDecrement,
}: QuantitySelectorProps) => {
  const rootStyle = "inline-flex w-full h-12 tems-center justify-between  border border-foreground";
  const classList = cn(rootStyle, className);

  return (
    <div className={classList}>
      <Button variant="ghost" className="h-full aspect-square p-0" onClick={onDecrement} disabled={value <= 0}>
        <MinusIcon className="w-5 h-5" />
      </Button>

      <div className="flex items-center  justify-center w-12 text-center">{value}</div>

      <Button variant="ghost" className="h-full aspect-square p-0" onClick={onIncrement} disabled={value >= maxValue}>
        <PlusIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};
