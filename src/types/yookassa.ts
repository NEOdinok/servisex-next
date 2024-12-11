export type YookassaPaymentResponse = {
  id: string;
  status: string;
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  description: string;
  metadata: Record<string, unknown>;
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  refundable: boolean;
  test: boolean;
};

export type YookassaPaymentRequest = {
  value: number;
  description: string;
  metadata: { orderId: number };
};
