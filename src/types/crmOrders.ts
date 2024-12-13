export type GetOrdersResponse = {
  success: boolean;
  pagination: {
    limit: number;
    totalCount: number;
    currentPage: number;
    totalPageCount: number;
  };
  orders: Order[];
};

type Order = {
  slug: number;
  bonusesCreditTotal: number;
  bonusesChargeTotal: number;
  id: number;
  number: string;
  customerComment?: string;
  orderType: string;
  orderMethod: string;
  privilegeType: string;
  countryIso: string;
  createdAt: string;
  statusUpdatedAt: string;
  summ: number;
  totalSumm: number;
  prepaySum: number;
  purchaseSumm: number;
  markDatetime: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  call: boolean;
  expired: boolean;
  managerId: number;
  customer: Customer;
  contact: Contact;
  contragent: Contragent;
  delivery: Delivery;
  site: string;
  status: string;
  items: OrderItem[];
  payments: Record<string, unknown>;
  fromApi: boolean;
  shipped: boolean;
  customFields: any[];
  currency: string;
};

type Customer = {
  type: string;
  id: number;
  isContact: boolean;
  createdAt: string;
  managerId: number;
  vip: boolean;
  bad: boolean;
  site: string;
  contragent: Contragent;
  tags: any[];
  customFields: any[];
  personalDiscount: number;
  marginSumm: number;
  totalSumm: number;
  averageSumm: number;
  ordersCount: number;
  address: Address;
  segments: any[];
  firstName: string;
  lastName: string;
  presumableSex: string;
  customerSubscriptions: CustomerSubscription[];
  phones: Phone[];
  mgCustomers: any[];
};

type Contact = Customer;

type Contragent = {
  contragentType: string;
};

type Delivery = {
  code: string;
  cost: number;
  netCost: number;
  address: {
    text: string;
  };
};

type OrderItem = {
  bonusesChargeTotal: number;
  bonusesCreditTotal: number;
  id: number;
  initialPrice: number;
  discounts: any[];
  discountTotal: number;
  prices: Price[];
  vatRate: string;
  createdAt: string;
  quantity: number;
  status: string;
  offer: Offer;
  properties: any[];
  purchasePrice: number;
  ordering: number;
};

type Price = {
  price: number;
  quantity: number;
};

type Offer = {
  displayName: string;
  id: number;
  name: string;
  vatRate: string;
  properties: OfferProperties;
};

type OfferProperties = {
  size?: string;
  color: string;
};

type Address = {
  id: number;
  countryIso: string;
  text: string;
};

type CustomerSubscription = {
  subscription: Subscription;
  subscribed: boolean;
};

type Subscription = {
  id: number;
  channel: string;
  name: string;
  code: string;
  active: boolean;
  autoSubscribe: boolean;
  ordering: number;
};

type Phone = {
  number: string;
};
