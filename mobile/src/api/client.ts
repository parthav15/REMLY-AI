import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG, STORAGE_KEYS } from "../constants";
import type { AuthResponse, Country, CreditPlan, RazorpayOrder, Reminder, User, VerifyPaymentResponse } from "../types";

const API_BASE = __DEV__ ? CONFIG.API_BASE_DEV : CONFIG.API_BASE_PROD;

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  skipAuth: boolean = false
): Promise<T> {
  const token = skipAuth ? null : await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function getCountries(): Promise<Country[]> {
  return request("/auth/countries/", {}, true);
}

export async function register(
  phone_number: string,
  timezone: string,
  password: string,
  country_id?: number
): Promise<AuthResponse> {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ phone_number, timezone, password, country_id }),
  }, true);
}

export async function login(
  phone_number: string,
  password: string
): Promise<AuthResponse> {
  return request("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ phone_number, password }),
  }, true);
}

export async function getMe(): Promise<User> {
  return request("/auth/me/");
}

export async function getReminders(): Promise<Reminder[]> {
  return request("/reminders/");
}

export async function createReminder(
  message: string,
  scheduled_at: string,
  is_recurring: boolean = false
): Promise<Reminder> {
  return request("/reminders/", {
    method: "POST",
    body: JSON.stringify({ message, scheduled_at, is_recurring }),
  });
}

export async function deleteReminder(id: string): Promise<void> {
  await request(`/reminders/${id}/`, { method: "DELETE" });
}

export async function getPlans(): Promise<CreditPlan[]> {
  return request("/payments/plans/");
}

export async function createOrder(plan_id: string): Promise<RazorpayOrder> {
  return request("/payments/create-order/", {
    method: "POST",
    body: JSON.stringify({ plan_id }),
  });
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<VerifyPaymentResponse> {
  return request("/payments/verify/", {
    method: "POST",
    body: JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
}
