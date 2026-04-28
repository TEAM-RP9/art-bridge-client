"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Stepper,
  FileUpload,
  ImagePreview,
  Button,
  FormField,
  Input,
  Textarea,
} from "@/components/ui";
import type { StepperStep } from "@/components/ui";
import { createArtwork, uploadArtworkImage, ApiError } from "@/api";
import type { CreateArtworkRequest } from "@/api";

const STEPS: StepperStep[] = [
  { id: "upload", label: "Upload", description: "Add your artwork image" },
  { id: "details", label: "Details", description: "Describe your artwork" },
  { id: "publish", label: "Publish", description: "Review and publish" },
];

const CATEGORY_OPTIONS = [
  "painting",
  "drawing",
  "sculpture",
  "photography",
  "printmaking",
  "digital",
  "mixed-media",
  "other",
];

interface ArtworkFormData {
  title: string;
  description: string;
  category: string;
  medium: string;
  widthStr: string;
  heightStr: string;
  unit: "cm" | "in" | "m";
  yearStr: string;
  tags: string[];
  status: "draft" | "published";
  showOnProfile: boolean;
}

const INITIAL_FORM: ArtworkFormData = {
  title: "",
  description: "",
  category: "",
  medium: "",
  widthStr: "",
  heightStr: "",
  unit: "cm",
  yearStr: String(new Date().getFullYear()),
  tags: [],
  status: "draft",
  showOnProfile: true,
};

// Simulate AI metadata extraction from filename / mime type
function extractAiMetadata(file: File): Partial<ArtworkFormData> {
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const autoTitle = nameWithoutExt
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  const lower = nameWithoutExt.toLowerCase();
  const mime = file.type;
  let autoCategory = "";
  let autoMedium = "";
  let autoTags: string[] = [];

  if (
    mime.startsWith("image/") &&
    (lower.includes("photo") ||
      lower.includes("img") ||
      lower.includes("dsc") ||
      lower.includes("pic") ||
      mime === "image/jpeg")
  ) {
    autoCategory = "photography";
    autoMedium = "Digital photography";
    autoTags = ["photography"];
  } else if (
    lower.includes("sketch") ||
    lower.includes("draw") ||
    lower.includes("pencil") ||
    lower.includes("ink")
  ) {
    autoCategory = "drawing";
    autoMedium = "Pencil on paper";
    autoTags = ["drawing", "sketch"];
  } else if (
    lower.includes("sculpt") ||
    lower.includes("clay") ||
    lower.includes("ceramic")
  ) {
    autoCategory = "sculpture";
    autoTags = ["sculpture"];
  } else if (
    lower.includes("print") ||
    lower.includes("linocut") ||
    lower.includes("etch")
  ) {
    autoCategory = "printmaking";
    autoTags = ["printmaking"];
  } else if (
    lower.includes("digital") ||
    lower.includes("cg") ||
    lower.includes("3d") ||
    lower.includes("render")
  ) {
    autoCategory = "digital";
    autoMedium = "Digital art";
    autoTags = ["digital art"];
  } else if (
    lower.includes("paint") ||
    lower.includes("oil") ||
    lower.includes("acrylic") ||
    lower.includes("watercolor") ||
    lower.includes("watercolour")
  ) {
    autoCategory = "painting";
    if (lower.includes("oil")) autoMedium = "Oil on canvas";
    else if (lower.includes("acrylic")) autoMedium = "Acrylic on canvas";
    else if (lower.includes("watercolor") || lower.includes("watercolour"))
      autoMedium = "Watercolour";
    autoTags = ["painting"];
  }

  return { title: autoTitle, category: autoCategory, medium: autoMedium, tags: autoTags };
}

export default function NewArtworkPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // AI analysis state
  const [aiState, setAiState] = useState<"idle" | "analyzing" | "done">("idle");
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState<ArtworkFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ArtworkFormData, string>>
  >({});
  const [tagInput, setTagInput] = useState("");
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      setUploadError(null);
      setImageFile(file);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);

      // Start AI analysis simulation
      setAiState("analyzing");
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      aiTimerRef.current = setTimeout(() => {
        const meta = extractAiMetadata(file);
        const filled = new Set<string>();

        setFormData((prev) => {
          const next = { ...prev };
          if (!prev.title && meta.title) { next.title = meta.title; filled.add("title"); }
          if (!prev.category && meta.category) { next.category = meta.category; filled.add("category"); }
          if (!prev.medium && meta.medium) { next.medium = meta.medium; filled.add("medium"); }
          if (prev.tags.length === 0 && meta.tags?.length) { next.tags = meta.tags; filled.add("tags"); }
          return next;
        });
        setAiFilledFields(filled);
        setAiState("done");
      }, 1800);
    },
    [imagePreviewUrl]
  );

  const handleRemoveImage = useCallback(() => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    setAiState("idle");
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
  }, [imagePreviewUrl]);

  const validateStep2 = (): boolean => {
    const errors: Partial<Record<keyof ArtworkFormData, string>> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (formData.title.trim().length > 100)
      errors.title = "Title is too long (max 100 chars)";
    if (formData.description.length > 1000)
      errors.description = "Description is too long (max 1000 chars)";
    if (formData.widthStr && Number.isNaN(Number(formData.widthStr)))
      errors.widthStr = "Width must be a number";
    if (formData.heightStr && Number.isNaN(Number(formData.heightStr)))
      errors.heightStr = "Height must be a number";
    if (formData.yearStr) {
      const y = Number(formData.yearStr);
      if (Number.isNaN(y) || y < 1800 || y > new Date().getFullYear())
        errors.yearStr = "Invalid year";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!imageFile) {
        setUploadError("Please select an image to upload");
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (validateStep2()) setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!imageFile) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: CreateArtworkRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category || undefined,
        medium: formData.medium.trim() || undefined,
        width: formData.widthStr ? Number(formData.widthStr) : undefined,
        height: formData.heightStr ? Number(formData.heightStr) : undefined,
        unit: formData.unit,
        year: formData.yearStr ? Number(formData.yearStr) : undefined,
        tags: formData.tags,
        status: formData.status,
        showOnProfile: formData.showOnProfile,
      };
      const artwork = await createArtwork(payload);
      await uploadArtworkImage(artwork.id, imageFile);
      router.push(`/dashboard/artworks/${artwork.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.detail || err.title || "Failed to save artwork");
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Add New Artwork</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your work with the world in three easy steps.
        </p>
      </div>

      <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

      {/* Step 1 – Upload */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upload Your Artwork</h2>
          <p className="text-sm text-muted-foreground">
            Start by uploading a high-quality image of your artwork.
          </p>
          {imagePreviewUrl ? (
            <ImagePreview
              src={imagePreviewUrl}
              alt="Selected artwork"
              aspectRatio="4/3"
              onRemove={handleRemoveImage}
            />
          ) : (
            <FileUpload
              accept="image/jpeg,image/png,image/webp"
              maxSizeMb={15}
              onChange={handleFileSelect}
              onError={setUploadError}
            />
          )}
          {uploadError && (
            <p className="text-sm text-destructive" role="alert">
              {uploadError}
            </p>
          )}

          {/* AI analysis indicator */}
          {aiState === "analyzing" && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
              <svg className="h-4 w-4 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">AI is analyzing your artwork</span> — extracting title, category and tags...
              </p>
            </div>
          )}

          {aiState === "done" && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700 dark:text-green-300">
                <span className="font-medium">AI suggestions ready</span> — fields pre-filled, you can edit them on the next step.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2 – Details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Artwork Details</h2>
            {aiFilledFields.size > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI pre-filled
              </span>
            )}
          </div>

          <FormField
            label="Title"
            htmlFor="title"
            error={formErrors.title}
            required
          >
            <div className="relative">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, title: e.target.value }));
                  setAiFilledFields((s) => { const n = new Set(s); n.delete("title"); return n; });
                }}
                placeholder="e.g. Sunset Over Tallinn"
                state={formErrors.title ? "error" : "default"}
                maxLength={100}
              />
              {aiFilledFields.has("title") && (
                <AiBadge />
              )}
            </div>
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
            error={formErrors.description}
          >
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Describe your artwork, technique, inspiration..."
              rows={5}
              maxLength={1000}
            />
            <p className="text-right text-xs text-muted-foreground">
              {formData.description.length}/1000
            </p>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Category" htmlFor="category">
              <div className="relative">
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, category: e.target.value }));
                    setAiFilledFields((s) => { const n = new Set(s); n.delete("category"); return n; });
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() +
                        cat.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
                {aiFilledFields.has("category") && <AiBadge />}
              </div>
            </FormField>

            <FormField label="Medium" htmlFor="medium">
              <div className="relative">
                <Input
                  id="medium"
                  value={formData.medium}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, medium: e.target.value }));
                    setAiFilledFields((s) => { const n = new Set(s); n.delete("medium"); return n; });
                  }}
                  placeholder="e.g. Oil on canvas"
                />
                {aiFilledFields.has("medium") && <AiBadge />}
              </div>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Width"
              htmlFor="width"
              error={formErrors.widthStr}
            >
              <Input
                id="width"
                type="number"
                value={formData.widthStr}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, widthStr: e.target.value }))
                }
                placeholder="e.g. 60"
                state={formErrors.widthStr ? "error" : "default"}
                min={0}
              />
            </FormField>
            <FormField
              label="Height"
              htmlFor="height"
              error={formErrors.heightStr}
            >
              <Input
                id="height"
                type="number"
                value={formData.heightStr}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, heightStr: e.target.value }))
                }
                placeholder="e.g. 80"
                state={formErrors.heightStr ? "error" : "default"}
                min={0}
              />
            </FormField>
            <FormField label="Unit" htmlFor="unit">
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    unit: e.target.value as "cm" | "in" | "m",
                  }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="cm">cm</option>
                <option value="in">inches</option>
                <option value="m">m</option>
              </select>
            </FormField>
          </div>

          <FormField
            label="Year Created"
            htmlFor="year"
            error={formErrors.yearStr}
          >
            <Input
              id="year"
              type="number"
              value={formData.yearStr}
              onChange={(e) =>
                setFormData((p) => ({ ...p, yearStr: e.target.value }))
              }
              placeholder={String(new Date().getFullYear())}
              state={formErrors.yearStr ? "error" : "default"}
              min={1800}
              max={new Date().getFullYear()}
            />
          </FormField>

          <FormField
            label="Tags"
            htmlFor="tag-input"
            description="Add up to 10 tags to help people find your work."
          >
            <div className="flex gap-2">
              <Input
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
              />
              <Button type="button" variant="outline" onClick={handleAddTag} size="md">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {aiFilledFields.has("tags") && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove ${tag}`}
                      className="ml-0.5 text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormField>
        </div>
      )}

      {/* Step 3 – Publish */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Review & Publish</h2>

          {imagePreviewUrl && (
            <div className="overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreviewUrl}
                alt="Artwork preview"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{formData.title}</h3>
                {formData.medium && (
                  <p className="text-sm text-muted-foreground">
                    {formData.medium}
                  </p>
                )}
                {formData.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-foreground">
                    {formData.description}
                  </p>
                )}
                {(formData.widthStr || formData.heightStr) && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formData.widthStr} × {formData.heightStr} {formData.unit}
                    {formData.yearStr && ` · ${formData.yearStr}`}
                  </p>
                )}
              </div>
            </div>
          )}

          <fieldset className="space-y-4 rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold">
              Publication Settings
            </legend>


                        <div className="flex cursor-pointer items-center justify-between">
                          <div className="flex items-start gap-2">
                            <input
                              id="show-on-profile-checkbox"
                              type="checkbox"
                              checked={formData.showOnProfile}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  showOnProfile: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded accent-primary mt-1"
                            />
                            <label htmlFor="show-on-profile-checkbox" className="block cursor-pointer">
                              <span className="text-sm font-medium" id="show-on-profile-label">Show on public profile</span>
                              <p className="text-xs text-muted-foreground">
                                Visitors can see this artwork on your profile page
                              </p>
                            </label>
                          </div>
                        </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Status</p>
              {(["draft", "published"] as const).map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={() => setFormData((p) => ({ ...p, status }))}
                    className="accent-primary"
                    id={`status-radio-${status}`}
                  />
                  <div>
                    <p className="text-sm font-medium capitalize" id={`status-label-${status}`}>{status}</p>
                    <p className="text-xs text-muted-foreground">
                      {status === "draft"
                        ? "Save privately, publish later"
                        : "Make visible to everyone now"}
                    </p>
                  </div>
                  <span className="sr-only">{status}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {submitError && (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={
            currentStep === 0
              ? () => router.push("/dashboard/artworks")
              : handleBack
          }
          disabled={isSubmitting}
        >
          {currentStep === 0 ? "Cancel" : "← Back"}
        </Button>

        {currentStep < 2 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 0 && aiState === "analyzing"}
          >
            {currentStep === 0 && aiState === "analyzing"
              ? "AI analyzing..."
              : "Continue →"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {formData.status === "published"
              ? "Publish Artwork"
              : "Save as Draft"}
          </Button>
        )}
      </div>
    </div>
  );
}

function AiBadge() {
  return (
    <span className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      AI
    </span>
  );
}
