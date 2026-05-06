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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { InputSkeleton, TextSkeleton } from "./skeletons/primitives";

interface FormDateFieldProps {
  field: any;
  label: string;
  placeholder?: string;
  className?: string;
  type?: "popover" | "dialog";
  showSkeleton?: boolean;
}

export function FormDateField({
  field,
  label,
  placeholder = "Select date",
  className,
  type = "popover",
  showSkeleton,
}: FormDateFieldProps) {
  const [open, setOpen] = useState(false);

  const isMobile = useIsMobile();

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

  const CalendarContent = (className?: string) => {
    return (
      <Calendar
        className={className}
        mode="single"
        selected={selectedDate}
        autoFocus
        onSelect={handleSelect}
      />
    );
  };

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
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label}</DrawerTitle>
            </DrawerHeader>
            <div className="mx-auto mb-24 mt-16">
              {CalendarContent("scale-150")}
            </div>
          </DrawerContent>
        </Drawer>
      ) : type === "popover" ? (
        <Popover>
          <PopoverTrigger asChild>{Trigger}</PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {CalendarContent()}
          </PopoverContent>
        </Popover>
      ) : (
        type === "dialog" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{Trigger}</DialogTrigger>
            <DialogContent className="w-fit">
              <DialogHeader>
                <DialogTitle className="text-center">{label}</DialogTitle>
              </DialogHeader>
              {CalendarContent("scale-116")}
            </DialogContent>
          </Dialog>
        )
      )}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
