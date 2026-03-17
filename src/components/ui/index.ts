/**
 * Barrel export for all UI primitives (design system atoms).
 * Import from "@/components/ui" instead of individual file paths.
 *
 * Example:
 *   import { Button, Badge } from "@/components/ui";
 */

// Keep entries alphabetically sorted.
export { Button, buttonVariants } from "./Button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./Button";

export { Code, Pre } from "./Code";
export type { CodeProps } from "./Code";

export { Heading } from "./Heading";
export type { HeadingProps } from "./Heading";

export { Input, inputVariants } from "./Input";
export type { InputProps } from "./Input";

export { Label } from "./Label";
export type { LabelProps } from "./Label";

export { Paragraph } from "./Paragraph";
export type { ParagraphProps } from "./Paragraph";

export { Switch, switchThumbVariants, switchTrackVariants } from "./Switch";
export type { SwitchProps } from "./Switch";

export { Textarea, textareaVariants } from "./Textarea";
export type { TextareaProps } from "./Textarea";
