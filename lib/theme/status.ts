export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-0";
    case "inactive":
      return "bg-muted text-muted-foreground";
    case "suspended":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-0";
    default:
      return "bg-muted text-muted-foreground border-muted";
  }
}
