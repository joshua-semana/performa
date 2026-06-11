import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import React, {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { cn } from "@/lib/utils";
import { InputSkeleton, TextSkeleton } from "./skeletons/primitives";

interface FormTextAreaFieldProps {
  field: any;
  label: string;
  placeholder?: string;
  required?: boolean;
  addOnContent?: React.ReactNode;
  description?: string;
  className?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  maxLength?: number;
  numericOnly?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  showSkeleton?: boolean;
}

export function FormTextAreaField({
  field,
  label,
  placeholder,
  required,
  addOnContent,
  description,
  className,
  autoComplete,
  maxLength,
  numericOnly,
  disabled,
  readOnly,
  showSkeleton,
}: FormTextAreaFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;

    if (numericOnly) {
      value = value.replace(/\D/g, "");
    }

    field.handleChange(value);
  };

  const currentLength = field.state.value?.length ?? 0;

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
      <InputGroup>
        <InputGroupTextarea
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
        />

        {addOnContent}

        {maxLength && (
          <InputGroupAddon align="block-end">
            <InputGroupText className="ml-auto">
              {currentLength}/{maxLength}
            </InputGroupText>
          </InputGroupAddon>
        )}

        {description && <FieldDescription>{description}</FieldDescription>}
      </InputGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
