"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components";
import { PossibleOffer } from "@/types";

interface Props {
  productToRemove?: PossibleOffer;
  isOpen: boolean;
  onOpenChange: (val: boolean) => void;
  handleRemoveProduct: () => void;
}

export const ConfirmationDialog = ({ productToRemove, isOpen, onOpenChange, handleRemoveProduct }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтвердите действие</DialogTitle>
          <DialogDescription>Убираем из корзины {productToRemove?.name}?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="min-w-20" onClick={() => onOpenChange(false)}>
            Нет
          </Button>
          <Button variant="destructive" className="min-w-20" onClick={handleRemoveProduct}>
            Да
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
