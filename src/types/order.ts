export type Customer = {
  type?: string;
  id?: number;
  isContact?: boolean;
  createdAt?: string;
  vip?: boolean;
  bad?: boolean;
  site?: string;
  contragent?: {
    contragentType?: string;
  };
  tags?: string[];
  customerSubscriptions?: {
    subscription?: {
      id?: number;
      channel?: string;
      name?: string;
      code?: string;
      active?: boolean;
      autoSubscribe?: boolean;
      ordering?: number;
    };
    subscribed?: boolean;
  }[];
  customFields?: unknown[];
  personalDiscount?: number;
  marginSumm?: number;
  totalSumm?: number;
  averageSumm?: number;
  ordersCount?: number;
  address?: {
    id?: number;
    countryIso?: string;
    text?: string;
  };
  segments?: unknown[];
  firstName?: string;
  lastName?: string;
  presumableSex?: string;
  phones?: {
    number?: string;
  }[];
  mgCustomers?: unknown[];
};

export type OrderItem = {
  bonusesChargeTotal?: number;
  bonusesCreditTotal?: number;
  id?: number;
  initialPrice?: number;
  discounts?: unknown[];
  discountTotal?: number;
  prices?: {
    price?: number;
    quantity?: number;
  }[];
  vatRate?: string;
  createdAt?: string;
  quantity?: number;
  status?: string;
  offer?: {
    displayName?: string;
    id: number;
    name?: string;
    vatRate?: string;
    properties?: {
      [key: string]: string;
    };
  };
  properties?: unknown[];
  purchasePrice?: number;
  ordering?: number;
};

export type Order = {
  slug?: number;
  bonusesCreditTotal?: number;
  bonusesChargeTotal?: number;
  id?: number;
  number?: string;
  orderType?: string;
  orderMethod?: string;
  privilegeType?: string;
  countryIso?: string;
  createdAt?: string;
  statusUpdatedAt?: string;
  summ?: number;
  customerComment?: string;
  totalSumm?: number;
  prepaySum?: number;
  purchaseSumm?: number;
  markDatetime?: string;
  lastName: string;
  firstName: string;
  phone: string;
  call?: boolean;
  expired?: boolean;
  customer?: Customer;
  contact?: Customer;
  email?: string;
  contragent?: {
    contragentType?: string;
  };
  delivery?: {
    code?: string;
    cost?: number;
    netCost?: number;
    address?: {
      text?: string;
    };
  };
  site?: string;
  status?: string;
  items?: OrderItem[];
  payments?: unknown[];
  fromApi?: boolean;
  shipped?: boolean;
  links?: unknown[];
  customFields?: unknown[];
  currency?: string;
};

export type CreateOrderResponse = {
  success: boolean;
  id: number;
  order: Order;
};
