/**
 * Barrel export for composed/shared components (design system molecules).
 * Import from "@/components/common" instead of individual file paths.
 *
 * Example:
 *   import { PageHeader, EmptyState } from "@/components/common";
 */

// Components will be added here as they are built in DS-8 and beyond.
// Keep entries alphabetically sorted.
export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { ImageDropzone } from "./ImageDropzone";
export type { ImageDropzoneProps, UploadState } from "./ImageDropzone";

export { PublicNav } from "./PublicNav";

export { PageHeader } from "./PageHeader";
export type { PageHeaderProps } from "./PageHeader";

export { Skeleton } from "./Skeleton";
export type { SkeletonProps } from "./Skeleton";

export { Stepper } from "./Stepper";
export type { StepperProps } from "./Stepper";
