export const COLORS = {
  brand: "#4f46e5",
  brandLight: "#e0e7ff",
  brandDark: "#3730a3",
  white: "#fff",
  placeholder: "#a0a0a0",
  border: "#e5e7eb",
  background: "#f9fafb",
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  textTertiary: "#9ca3af",
  switchTrackOff: "#e5e7eb",
  red: "#dc2626",
  redBorder: "#fecaca",
  indigo200: "#c7d2fe",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
} as const;

export const CONFIG = {
  API_BASE_DEV: "http://192.168.1.8:8000/api/v1",
  API_BASE_PROD: "https://api.remly.ai/api/v1",
  REMINDER_CREDIT_COST: 1,
  DEFAULT_REMINDER_OFFSET_MS: 60 * 60 * 1000,
  MAX_MESSAGE_LENGTH: 500,
} as const;

export const CONTACT = {
  PHONE: "+19162325828",
  DISPLAY_NAME: "Remly AI Assistant",
  FIRST_NAME: "Remly AI",
  LAST_NAME: "Assistant",
  PHONE_LABEL: "mobile",
} as const;

export const TAB_BAR = {
  HEIGHT_IOS: 88,
  HEIGHT_ANDROID: 64,
  PADDING_BOTTOM_IOS: 24,
  PADDING_BOTTOM_ANDROID: 8,
  PADDING_TOP: 8,
  FONT_SIZE: 12,
  FONT_WEIGHT: "600" as const,
  HEADER_FONT_WEIGHT: "700" as const,
} as const;
