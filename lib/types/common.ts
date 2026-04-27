import { LucideIcon } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isVisible?: boolean;
}
