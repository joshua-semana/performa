import { ACTIVE, ARCHIVED, INACTIVE, SUSPENDED } from "../constants/user";

export function getStatusColor(status: string): string {
  switch (status) {
    case ACTIVE:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-0";
    case INACTIVE:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300 border-0";
    case SUSPENDED:
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-0";
    case ARCHIVED:
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-0";
    default:
      return "bg-muted text-muted-foreground border-0";
  }
}
