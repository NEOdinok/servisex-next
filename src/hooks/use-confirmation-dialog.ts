"use client";

import { useState } from "react";
import { PossibleOffer } from "@/types";
import { useCart } from "./use-store";

export const useProductDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [offerToRemove, setOfferToRemove] = useState<PossibleOffer | undefined>();
  const { removeItem } = useCart();

  const prepareProductForDeletion = (offer?: PossibleOffer) => {
    if (offer) {
      setOfferToRemove(offer);
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleRemoveProduct = () => {
    if (offerToRemove) {
      removeItem(offerToRemove.id);
      setIsDialogOpen(false);
    } else {
      setIsDialogOpen(false);
    }
  };

  return {
    setIsDialogOpen,
    isDialogOpen,
    offerToRemove,
    prepareProductForDeletion,
    handleRemoveProduct,
  };
};
