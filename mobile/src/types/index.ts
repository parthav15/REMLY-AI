export interface User {
  id: string;
  phone_number: string;
  timezone: string;
  credits: number;
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
