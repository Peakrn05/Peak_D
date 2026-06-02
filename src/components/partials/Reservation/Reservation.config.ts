/**
 * Reservation Configuration
 * Constants, defaults, and UI configuration for reservation feature
 */

export const RESERVATION_STORAGE_KEY = "reservation-filters";

export const DEFAULT_FILTERS = {
  status: "all",
  dateRange: "upcoming",
};

export const SERVICE_ICONS: Record<string, string> = {
  GROOMING: "✂️",
  SHOWER: "🚿",
  VACCINE: "💉",
};

export const SERVICE_COLORS: Record<string, string> = {
  GROOMING: "from-amber-400 to-orange-500",
  SHOWER: "from-blue-400 to-cyan-500",
  VACCINE: "from-green-400 to-emerald-500",
};

export const BOOKING_STEPS = [
  { key: 1, label: "Select Pet" },
  { key: 2, label: "Choose Service" },
  { key: 3, label: "Book Time" },
  { key: 4, label: "Payment" },
  { key: 5, label: "Confirm" },
] as const;
