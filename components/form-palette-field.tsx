import { capitalize, cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { COLOR_TYPES, colorMap, ColorType } from "@/lib/constants/color";
import { Check } from "lucide-react";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface FormPaletteFieldProps {
  field: any;
  label: string;
  description?: string;
}

export function FormPaletteField({
  field,
  label,
  description,
}: FormPaletteFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldSet>
      <FieldLegend>{label}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        className="flex flex-wrap gap-2"
      >
        {COLOR_TYPES.map((color) => (
          <Tooltip key={color}>
            <TooltipTrigger asChild>
              <label
                key={color}
                htmlFor={`form-palette-${color}`}
                className="cursor-pointer"
              >
                <RadioGroupItem
                  value={color}
                  id={`form-palette-${color}`}
                  aria-invalid={isInvalid}
                  className="sr-only hidden"
                />

                <div
                  className={cn(
                    "relative h-10 w-10 rounded-full transition-all hover:scale-95",
                    colorMap[color].solid,
                    field.state.value === color &&
                      "dark:ring-2 dark:ring-white scale-110",
                  )}
                >
                  {field.state.value === color && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                  )}
                </div>
              </label>
            </TooltipTrigger>
            <TooltipContent>{capitalize(color)}</TooltipContent>
          </Tooltip>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </FieldSet>
  );
}
