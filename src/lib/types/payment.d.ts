export interface PaymentProvider {
  id: string;
  provider: "PayTR" | "Papara" | "Shipy";
  name: string;
  isActive: boolean;
  priority: number;
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  description: string;
}

export interface InitiatePaymentData {
  websiteId: string;
  providerId: string;
  amount: number;
  currency: "TRY";
  basket: {
    name: string;
    price: string;
    quantity: number;
  }[];
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface InitiatePaymentResponse {
  success: boolean;
  type: "iframe" | "redirect";
  iframeHtml: string;
  redirectUrl: string;
  payment_id: string;
}

export interface CheckPaymentData {
  website_id: string;
  payment_id: string;
}
