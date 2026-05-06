import { SelectOption } from "@/lib/types/common";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { InputSkeleton, TextSkeleton } from "./skeletons/primitives";

interface FormSelectFieldProps {
  field: any;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
  position?: "popper" | "item-aligned" | undefined;

  options: SelectOption[];

  dataLoading?: boolean;
  emptyMessage?: string;
  disabled?: boolean;

  showSkeleton?: boolean;
}

export function FormSelectField({
  field,
  label,
  placeholder,
  required,
  description,
  className,
  position = "popper",
  options,
  dataLoading = false,
  emptyMessage = "No items found",
  disabled = false,
  showSkeleton,
}: FormSelectFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  if (showSkeleton) {
    return (
      <div className="flex flex-col gap-4">
        <TextSkeleton />
        <InputSkeleton />
      </div>
    );
  }

  return (
    <Field data-invalid={isInvalid} className={cn(className)}>
      <FieldLabel htmlFor={field.name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>

      <div className="flex gap-2">
        <Select
          key={field.state.value ?? "empty"}
          value={field.state.value ?? ""}
          onValueChange={field.handleChange}
          disabled={disabled}
        >
          <SelectTrigger aria-invalid={isInvalid} className="w-full">
            <SelectValue
              placeholder={dataLoading ? "Loading ..." : placeholder}
            />
          </SelectTrigger>

          <SelectContent position={position}>
            {dataLoading ? (
              <SelectItem value="loading" disabled>
                Loading ...
              </SelectItem>
            ) : options.length === 0 ? (
              <SelectItem value="empty" disabled>
                {emptyMessage}
              </SelectItem>
            ) : (
              options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {!required && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => field.handleChange("")}
            disabled={!field.state.value}
          >
            <X />
          </Button>
        )}
      </div>

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
