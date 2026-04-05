export interface CountryTimezone {
  timezone: string;
}

export interface Country {
  id: number;
  name: string;
  iso_code: string;
  calling_code: string;
  flag: string;
  timezones: CountryTimezone[];
}

export interface User {
  id: string;
  phone_number: string;
  timezone: string;
  credits: number;
  country: Country | null;
}

export interface Reminder {
  id: string;
  message: string;
  scheduled_at: string;
  status: "pending" | "triggered" | "answered" | "missed";
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  amount_paise: number;
  display_price: string;
}

export interface RazorpayOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan: CreditPlan;
}

export interface VerifyPaymentResponse {
  detail: string;
  credits_added: number;
  total_credits: number;
}
