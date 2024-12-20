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

export type YookassaPaymentNotification = "payment.waiting_for_capture" | "payment.succeeded" | "payment.canceled";

export type YookassaCreatePaymentResponse = {
  id: string;
  status: "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  amount: {
    value: string; // e.g., "2.00"
    currency: string; // e.g., "RUB"
  };
  authorization_details?: {
    rrn: string;
    auth_code: string;
    three_d_secure?: {
      applied: boolean;
    };
  };
  created_at: string; // ISO date string
  description: string;
  expires_at?: string; // Optional ISO date string
  metadata?: Record<string, any>;
  payment_method: {
    type: string;
    id: string;
    saved: boolean;
    card?: {
      first6: string;
      last4: string;
      expiry_month: string;
      expiry_year: string;
      card_type: string;
      card_product?: {
        code: string;
        name: string;
      };
      issuer_country: string;
      issuer_name: string;
    };
    title: string;
  };
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  refundable: boolean;
  test: boolean;
  income_amount?: {
    value: string;
    currency: string;
  };
};

export type YookassaCapturePaymentBody = {
  amount: {
    value: string;
    currency: string;
  };
};
