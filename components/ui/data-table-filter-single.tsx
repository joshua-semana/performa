import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

interface FilterOption {
  label: string;
  value: string;
}

interface DataTableSingleFilterProps {
  label: string;
  placeholder?: string;
  value?: string;
  options: FilterOption[];
  onChange: (value?: string) => void;
}

export function DataTableSingleFilter({
  label,
  placeholder,
  value,
  options,
  onChange,
}: DataTableSingleFilterProps) {
  const selectOptions = [
    { label: `All ${label.toLowerCase()}`, value: "all" },
    ...options,
  ];

  // This makes it look like: "Status: Active"
  // const triggerText = value
  //   ? `${label}: ${
  //       options.find((option) => option.value === value)?.label ?? value
  //     }`
  //   : `All ${label.toLowerCase()}`;

  return (
    <>
      <Select
        value={value ?? "all"}
        onValueChange={(val) => onChange(val === "all" ? undefined : val)}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
