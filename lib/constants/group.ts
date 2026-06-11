import {
  BriefcaseBusiness,
  Building,
  Cog,
  GraduationCap,
  LucideIcon,
  Shield,
  Users,
} from "lucide-react";
import { capitalize } from "../utils";

export const GROUP_TYPES = [
  "DEPARTMENT",
  "TEAM",
  "ACADEMIC",
  "ADMINISTRATIVE",
  "POSITIONAL",
  "SYSTEM",
  "CUSTOM",
] as const;

export type GroupType = (typeof GROUP_TYPES)[number];

export const groupTypeOptions = GROUP_TYPES.map((type) => ({
  label: capitalize(type),
  value: type,
}));

type GroupConfig = Record<
  GroupType,
  {
    label: string;
    acronym: string;
    icon: LucideIcon;
  }
>;

export const groupMap: GroupConfig = {
  DEPARTMENT: {
    label: "Department",
    acronym: "DEPT",
    icon: Building,
  },

  TEAM: {
    label: "Team",
    acronym: "TEAM",
    icon: Users,
  },

  ACADEMIC: {
    label: "Academic",
    acronym: "ACAD",
    icon: GraduationCap,
  },

  ADMINISTRATIVE: {
    label: "Administrative",
    acronym: "ADMN",
    icon: BriefcaseBusiness,
  },

  POSITIONAL: {
    label: "Positional",
    acronym: "POST",
    icon: Shield,
  },

  SYSTEM: {
    label: "System",
    acronym: "SYSM",
    icon: Cog,
  },

  CUSTOM: {
    label: "Custom",
    acronym: "CSTM",
    icon: Users,
  },
};
