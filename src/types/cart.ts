import { PossibleOffer } from "./product";

export interface CartItem extends PossibleOffer {
  quantity: number;
}
