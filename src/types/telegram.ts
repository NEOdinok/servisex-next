export type TelegramOrderDetails = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  delivery: string;
  productsPrice: number;
  deliveryPrice: number;
  customerComment?: string;
  totalPrice: number;
};
