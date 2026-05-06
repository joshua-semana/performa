import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fullname Formatter

type NameFormatOptions = {
  order?: "firstLast" | "lastFirst";
  middle?: "full" | "initial" | "none";
  initials?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
};

type NameParts = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
};

export function formatFullName(
  { firstName, middleName, lastName, suffix }: NameParts,
  options: NameFormatOptions = {},
) {
  const {
    order = "firstLast",
    middle = "initial",
    initials = false,
    uppercase = false,
    lowercase = false,
  } = options;

  const first = firstName?.trim() || "";
  const middleRaw = middleName?.trim() || "";
  const last = lastName?.trim() || "";

  const middleFormatted =
    middle === "full"
      ? middleRaw
      : middle === "initial" && middleRaw
        ? `${middleRaw.charAt(0)}.`
        : "";

  let name = "";

  // Initials mode (e.g., J. D.)
  if (initials) {
    const parts = [first, middleRaw, last]
      .filter(Boolean)
      .map((n) => `${n.charAt(0)}.`);
    name = parts.join(" ");
  } else {
    if (order === "lastFirst") {
      name = [last, first, middleFormatted]
        .filter(Boolean)
        .join(", ")
        .replace(", ", ", "); // keeps "Last, First M."
    } else {
      name = [first, middleFormatted, last].filter(Boolean).join(" ");
    }
  }

  if (suffix) {
    name += `, ${suffix}`;
  }

  // casing rules
  if (uppercase) {
    name = name.toUpperCase();
  } else if (lowercase) {
    name = name.toLowerCase();
  }

  return name.trim();
}

export function formatPhoneNumber(phoneNumber?: string) {
  if (!phoneNumber) return undefined;

  // This makes all non-digit to nothing
  let digits = phoneNumber.replace(/\D/g, "");

  return `+971 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}

export function capitalize(text: string) {
  if (!text) return "";

  return text
    .trim()
    .replace(/_/g, " ")
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

const DEFAULT_TIMEZONE = "Asia/Dubai";

export function toDate(value?: string | number | Date | null) {
  if (!value) return null;

  const date = new Date(value);

  if (isNaN(date.getTime())) return null;

  return date;
}

export function formatDate(
  value?: string | number | Date | null,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = toDate(value);

  if (!date) return undefined;

  return new Intl.DateTimeFormat("en-US", {
    timeZone: DEFAULT_TIMEZONE,
    ...options,
  }).format(date);
}

export function formatBirthday(value?: string | null) {
  return formatDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(value?: string | null) {
  return formatDate(value, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(value?: string | null) {
  return formatDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Relative Time
// Example: 2 days ago

export function formatRelativeTime(value?: string | null) {
  const date = toDate(value);
  if (!date) return "-";

  const now = new Date();
  const diff = date.getTime() - now.getTime();

  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  if (Math.abs(days) < 30) return rtf.format(days, "day");
  if (Math.abs(months) < 12) return rtf.format(months, "month");

  return rtf.format(years, "year");
}

export function getAge(value?: string | null) {
  const birth = toDate(value);
  if (!birth) return "-";

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function sortDates(
  a?: string | null,
  b?: string | null,
  order: "asc" | "desc" = "asc",
) {
  const first = toDate(a)?.getTime() ?? 0;
  const second = toDate(b)?.getTime() ?? 0;

  return order === "asc" ? first - second : second - first;
}

export function generateRandomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";

  let randomPassword = "";

  for (let i = 0; i < 8; i++) {
    randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return randomPassword;
}

export function getChangedFields(
  original: Record<string, any>,
  current: Record<string, any>,
) {
  const changes: Record<string, any> = {};

  for (const key in current) {
    if (current[key] !== original[key]) {
      changes[key] = current[key];
    }
  }

  return changes;
}
