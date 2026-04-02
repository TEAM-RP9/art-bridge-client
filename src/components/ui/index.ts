/**
 * Barrel export for all UI primitives (design system atoms).
 * Import from "@/components/ui" instead of individual file paths.
 *
 * Example:
 *   import { Button, Input } from "@/components/ui";
 */

// Keep entries alphabetically sorted.
export { Badge, badgeVariants } from "./Badge";
export type { BadgeProps } from "./Badge";

export { Button, buttonVariants } from "./Button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./Button";

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./Card";
export type {
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
} from "./Card";

export { Code, Pre } from "./Code";
export type { CodeProps } from "./Code";

export { FormField } from "./FormField";
export type { FormFieldProps } from "./FormField";

export { Heading } from "./Heading";
export type { HeadingProps } from "./Heading";

export { Input, inputVariants } from "./Input";
export type { InputProps } from "./Input";

export { Label } from "./Label";
export type { LabelProps } from "./Label";

export { Paragraph } from "./Paragraph";
export type { ParagraphProps } from "./Paragraph";

export { ProgressCard, progressFillVariants, progressToneVariants } from "./ProgressCard";
export type { ProgressCardProps } from "./ProgressCard";

export {
	CardSkeleton,
	ProgressCardSkeleton,
	Skeleton,
	skeletonVariants,
	StatCardSkeleton,
} from "./Skeleton";
export type { CardSkeletonProps, SkeletonProps } from "./Skeleton";

export { StatCard, statTrendVariants } from "./StatCard";
export type { StatCardProps } from "./StatCard";

export { TagChip, tagChipVariants } from "./TagChip";
export type { TagChipProps } from "./TagChip";

export { Switch, switchThumbVariants, switchTrackVariants } from "./Switch";
export type { SwitchProps } from "./Switch";

export { Textarea, textareaVariants } from "./Textarea";
export type { TextareaProps } from "./Textarea";
