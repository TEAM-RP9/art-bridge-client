import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepperProps {
  steps: { label: string }[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: Readonly<StepperProps>) {
  return (
    <nav aria-label="Progress" className={cn("flex items-center", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isCompleted = stepNumber < current;

        return (
          <React.Fragment key={step.label}>
            {index > 0 && (
              <div
                className={cn(
                  "mx-3 h-px min-w-8 flex-1",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  isActive || isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-transparent text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {stepNumber}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-xs",
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

Stepper.displayName = "Stepper";