import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthResponse, Reminder, User } from "../types";

const API_BASE = __DEV__
  ? "http://localhost:8000/api/v1"
  : "https://api.remly.ai/api/v1";

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
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

// Auth
export async function register(
  phone_number: string,
  timezone: string,
  password: string
): Promise<AuthResponse> {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ phone_number, timezone, password }),
  });
}

export async function login(
  phone_number: string,
  password: string
): Promise<AuthResponse> {
  return request("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ phone_number, password }),
  });
}

export async function getMe(): Promise<User> {
  return request("/auth/me/");
}

// Reminders
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
