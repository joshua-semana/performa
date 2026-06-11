import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface FieldSearchProps {
  searchValue: string;
  onSearch: (value: string) => void;
  className?: string;
}

export function FieldSearch({
  searchValue,
  onSearch,
  className,
}: FieldSearchProps) {
  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput
        placeholder="Search ..."
        value={searchValue ?? ""}
        onChange={(e) => onSearch(e.target.value)}
      />
      <InputGroupAddon>
        <search />
      </InputGroupAddon>
    </InputGroup>
  );
}
