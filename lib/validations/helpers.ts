import z from "zod";

export const optionalText = () => z.string().trim().or(z.literal(""));

export const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

export const optionalPhone = () =>
  z
    .string()
    .regex(/^[0-9]{9}$/, "Phone number must contain 9 digits")
    .or(z.literal(""));
