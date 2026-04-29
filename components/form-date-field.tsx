"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Field, FieldError, FieldLabel } from "./ui/field";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface FormDateFieldProps {
  field: any;
  label: string;
  placeholder?: string;
  className?: string;
  type?: "popover" | "dialog";
}

export function FormDateField({
  field,
  label,
  placeholder = "Select date",
  className,
  type = "popover",
}: FormDateFieldProps) {
  const [open, setOpen] = useState(false);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const selectedDate = field.state.value
    ? new Date(field.state.value)
    : undefined;

  const displayText = selectedDate ? format(selectedDate, "PPP") : placeholder;

  const handleSelect = (date?: Date) => {
    if (!date) {
      field.handleChange("");
      return;
    }

    field.handleChange(date.toISOString());
    setOpen(false);
  };

  const Trigger = (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full justify-start text-left font-normal truncate",
        !selectedDate && "text-muted-foreground",
      )}
    >
      <CalendarIcon className="mr-2 size-4" />
      {displayText}
    </Button>
  );

  const CalendarContent = (
    <Calendar
      mode="single"
      selected={selectedDate}
      autoFocus
      onSelect={handleSelect}
    />
  );

  return (
    <Field data-invalid={isInvalid} className={cn(className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      {type === "popover" && (
        <Popover>
          <PopoverTrigger asChild>{Trigger}</PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            {CalendarContent}
          </PopoverContent>
        </Popover>
      )}

      {type === "dialog" && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{Trigger}</DialogTrigger>

          <DialogContent className="w-fit p-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4 pb-0">
              <DialogTitle>{label}</DialogTitle>
            </DialogHeader>

            <div className="p-4 pt-2">{CalendarContent}</div>
          </DialogContent>
        </Dialog>
      )}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
