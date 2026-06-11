export const COLOR_TYPES = [
  "amber",
  "blue",
  "emerald",
  "purple",
  "rose",
  "slate",
] as const;

export type ColorType = (typeof COLOR_TYPES)[number];

export const colorMap = {
  amber: {
    solid: "bg-amber-500",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-0",
  },
  blue: {
    solid: "bg-blue-500",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-0",
  },
  emerald: {
    solid: "bg-emerald-500",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-0",
  },
  purple: {
    solid: "bg-purple-500",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border-0",
  },
  rose: {
    solid: "bg-rose-500",
    badge:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border-0",
  },
  slate: {
    solid: "bg-slate-500",
    badge:
      "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300 border-0",
  },
};
