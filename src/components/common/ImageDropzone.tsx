"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type UploadState =
  | { status: "hydrating" }
  | { status: "idle" }
  | { status: "dragging" }
  | { status: "uploading"; fileName: string }
  | { status: "uploaded"; previewUrl: string; remoteUrl: string }
  | { status: "error"; message: string };

export interface ImageDropzoneProps {
  state: UploadState;
  onFiles: (files: FileList) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  className?: string;
}

export const ImageDropzone = React.forwardRef<HTMLDivElement, ImageDropzoneProps>(function ImageDropzone(
  { state, onFiles, onDragEnter, onDragLeave, className },
  ref
) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (state.status === "uploading" || state.status === "uploaded") return;
    onDragEnter();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (state.status === "uploaded") return;
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      onDragLeave();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (state.status === "uploading" || state.status === "uploaded") return;
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      onFiles(files);
    } else {
      onDragLeave();
    }
  };

  const isDragging = state.status === "dragging";
  const isUploading = state.status === "uploading";
  const isUploaded = state.status === "uploaded";
  const isHydrating = state.status === "hydrating";
  const isError = state.status === "error";
  const showIdleContent = state.status === "idle" || isDragging;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        isUploaded && "overflow-hidden",
        isUploading && "opacity-70",
        !isUploaded && "min-h-[200px]",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={handleFileInput}
        disabled={isUploading}
        aria-label="Upload artwork image"
      />

      {isHydrating && <div className="h-48 w-full animate-pulse rounded-lg bg-muted" />}

      {showIdleContent && (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <UploadCloudIcon className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Drag and drop your artwork here</p>
            <p className="text-xs text-muted-foreground">
              or{" "}
              <button
                type="button"
                className="text-primary underline hover:no-underline focus-visible:outline-none"
                onClick={() => inputRef.current?.click()}
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-muted-foreground">PNG or JPG, max 10MB</p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <SpinnerIcon className="h-8 w-8 animate-spin text-primary" />
          <p className="max-w-[200px] truncate text-sm text-muted-foreground">{state.fileName}</p>
        </div>
      )}

      {isUploaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={state.previewUrl}
          alt="Artwork preview"
          className="max-h-[60vh] w-full object-contain"
        />
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <UploadCloudIcon className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Drag and drop your artwork here</p>
            <p className="text-xs text-muted-foreground">
              or{" "}
              <button
                type="button"
                className="text-primary underline hover:no-underline focus-visible:outline-none"
                onClick={() => inputRef.current?.click()}
              >
                browse files
              </button>
            </p>
          </div>
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        </div>
      )}
    </div>
  );
});

ImageDropzone.displayName = "ImageDropzone";

function UploadCloudIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.75 5.75 0 0 1 1.088 11.095H6.75Z"
      />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}
