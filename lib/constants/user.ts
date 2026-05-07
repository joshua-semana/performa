import { SelectOption } from "../types/common";

export const ACTIVE = "active";
export const INACTIVE = "inactive";
export const SUSPENDED = "suspended";
export const ARCHIVED = "archived";

export const userStatusOptions: SelectOption[] = [
  {
    label: "Active",
    value: ACTIVE,
  },
  {
    label: "Inactive",
    value: INACTIVE,
  },
  {
    label: "Suspended",
    value: SUSPENDED,
  },
  {
    label: "Archived",
    value: ARCHIVED,
  },
];
