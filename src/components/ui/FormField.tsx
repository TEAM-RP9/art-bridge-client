import * as React from "react";
import { cn } from "@/lib/utils";
import { Label, type LabelProps } from "./Label";
import { Paragraph } from "./Paragraph";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  actionSlot?: React.ReactNode;
  labelProps?: Omit<LabelProps, "children" | "required" | "htmlFor">;
  children: React.ReactNode;
}

export function FormField({
  className,
  label,
  htmlFor,
  description,
  error,
  required,
  actionSlot,
  labelProps,
  children,
  ...props
}: Readonly<FormFieldProps>) {
  const hasError = Boolean(error);
  let message: React.ReactNode = null;

  if (hasError) {
    message = (
      <Paragraph
        size="sm"
        color="default"
        className="text-destructive"
        role="alert"
      >
        {error}
      </Paragraph>
    );
  } else if (description) {
    message = (
      <Paragraph size="sm" color="muted">
        {description}
      </Paragraph>
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {(label || actionSlot) && (
        <div
          className={cn(
            "flex items-start gap-3",
            label && actionSlot ? "justify-between" : "justify-start"
          )}
        >
          {label ? (
            <Label
              htmlFor={htmlFor}
              required={required}
              {...labelProps}
            >
              {label}
            </Label>
          ) : null}
          {actionSlot}
        </div>
      )}

      {children}

      {message}
    </div>
  );
}
