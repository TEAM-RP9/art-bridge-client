"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onError"> {
  accept?: string;
  maxSizeMb?: number;
  onChange?: (file: File) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function FileUpload({
  accept = "image/*",
  maxSizeMb = 10,
  onChange,
  onError,
  disabled = false,
  isLoading = false,
  className,
  ...props
}: Readonly<FileUploadProps>) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateAndEmit = React.useCallback(
    (file: File) => {
      const maxBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        onError?.(`File is too large. Maximum size is ${maxSizeMb} MB.`);
        return;
      }
      onChange?.(file);
    },
    [maxSizeMb, onChange, onError]
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || isLoading) return;
      const file = e.dataTransfer.files[0];
      if (file) validateAndEmit(file);
    },
    [disabled, isLoading, validateAndEmit]
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndEmit(file);
      e.target.value = "";
    },
    [validateAndEmit]
  );

  const isInteractive = !disabled && !isLoading;

  return (
    <div
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-disabled={!isInteractive}
      aria-label="Upload file – click or drag and drop"
      onClick={() => isInteractive && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (isInteractive) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3",
        "rounded-xl border-2 border-dashed transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
        !isInteractive && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleInputChange}
        disabled={!isInteractive}
        tabIndex={-1}
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <svg
            className="h-8 w-8 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              isDragOver
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragOver
                ? "Drop your image here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG, WEBP – up to {maxSizeMb} MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}
