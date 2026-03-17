import * as React from "react";
import { cn } from "@/lib/utils";
import { Label, type LabelProps } from "./Label";
import { Paragraph } from "./Paragraph";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label shown above the control. */
  label?: string;
  /** For linking label to input via id/htmlFor. */
  htmlFor?: string;
  /** Optional helper text displayed under the control when no error exists. */
  description?: string;
  /** Error text displayed under the control and marked as alert. */
  error?: string;
  /** Marks label as required and can be mirrored to the form control. */
  required?: boolean;
  /** Optional action slot rendered next to label (e.g. hint button). */
  actionSlot?: React.ReactNode;
  /** Pass custom label props if needed. */
  labelProps?: Omit<LabelProps, "children" | "required" | "htmlFor">;
  children: React.ReactNode;
}

/**
 * FormField is a layout wrapper for form controls.
 * It standardizes label, helper text, and error text rendering.
 */
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
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {(label || actionSlot) && (
        <div className="flex items-start justify-between gap-3">
          {label ? (
            <Label
              htmlFor={htmlFor}
              required={required}
              {...labelProps}
            >
              {label}
            </Label>
          ) : (
            <span />
          )}
          {actionSlot}
        </div>
      )}

      {children}

      {hasError ? (
        <Paragraph
          size="sm"
          color="default"
          className="text-destructive"
          role="alert"
        >
          {error}
        </Paragraph>
      ) : description ? (
        <Paragraph size="sm" color="muted">
          {description}
        </Paragraph>
      ) : null}
    </div>
  );
}
