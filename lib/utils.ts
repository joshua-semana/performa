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
