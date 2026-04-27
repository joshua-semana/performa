import { SelectOption } from "./common";

export interface FilterConfig {
  key: string;
  label: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value?: string) => void;
}
