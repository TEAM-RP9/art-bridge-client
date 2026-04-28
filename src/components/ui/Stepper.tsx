"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  currentStep: number;
}

const stepCircleVariants = cva(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
  {
    variants: {
      state: {
        completed: "border-primary bg-primary text-primary-foreground",
        current: "border-primary bg-background text-primary",
        upcoming: "border-border bg-background text-muted-foreground",
      },
    },
  }
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function Stepper({
  steps,
  currentStep,
  className,
  ...props
}: Readonly<StepperProps>) {
  return (
    <ol
      className={cn("flex items-center", className)}
      aria-label="Progress"
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const state = isCompleted
          ? "completed"
          : isCurrent
          ? "current"
          : "upcoming";
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.id}
            className={cn("flex items-center", !isLast && "flex-1")}
            aria-current={isCurrent ? "step" : undefined}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(stepCircleVariants({ state }))}>
                {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-3 mb-6 h-0.5 flex-1 transition-colors",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
