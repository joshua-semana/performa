import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import React, {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { cn } from "@/lib/utils";

interface FormTextFieldProps {
  field: any;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  addOnContent?: React.ReactNode;
  description?: string;
  className?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  maxLength?: number;
  numericOnly?: boolean;
}

export function FormTextField({
  field,
  label,
  placeholder,
  required,
  type,
  addOnContent,
  description,
  className,
  autoComplete,
  maxLength,
  numericOnly,
}: FormTextFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (numericOnly) {
      value = value.replace(/\D/g, "");
    }

    field.handleChange(value);
  };

  return (
    <Field data-invalid={isInvalid} className={cn(className)}>
      <FieldLabel htmlFor={field.name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={handleChange}
          type={type}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          maxLength={maxLength}
        />
        {addOnContent}
        {description && <FieldDescription>{description}</FieldDescription>}
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
