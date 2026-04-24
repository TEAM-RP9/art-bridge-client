import * as React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: {
    title: string;
    description?: string;
  }[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2 flex-1 relative">
              <div
                className={cn(
                  "h-10 w-10 rounded-full border-2 flex items-center justify-center font-semibold transition-colors z-10",
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "bg-background border-primary text-primary"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    index <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute h-[2px] w-full left-[50%] top-5 -z-0",
                    index < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
