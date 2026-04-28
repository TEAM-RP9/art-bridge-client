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

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS: StepperStep[] = [
  { id: "upload", label: "Upload", description: "Add your artwork image" },
  { id: "details", label: "Details", description: "Describe your artwork" },
  { id: "publish", label: "Publish", description: "Review and publish" },
];

const CATEGORY_OPTIONS = [
  "painting", "drawing", "sculpture", "photography",
  "printmaking", "digital", "mixed-media", "other",
];

const INITIAL_FORM: ArtworkFormData = {
  title: "", description: "", category: "", medium: "",
  widthStr: "", heightStr: "", unit: "cm",
  yearStr: String(new Date().getFullYear()),
  tags: [], status: "draft", showOnProfile: true,
};

// ── AI metadata extraction ────────────────────────────────────────────────────

function extractAiMetadata(file: File): Partial<ArtworkFormData> {
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  const autoTitle = nameWithoutExt
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  const lower = nameWithoutExt.toLowerCase();
  const mime = file.type;

  if (mime.startsWith("image/") && (lower.includes("photo") || lower.includes("img") || lower.includes("dsc") || lower.includes("pic") || mime === "image/jpeg")) {
    return { title: autoTitle, category: "photography", medium: "Digital photography", tags: ["photography"] };
  }
  if (lower.includes("sketch") || lower.includes("draw") || lower.includes("pencil") || lower.includes("ink")) {
    return { title: autoTitle, category: "drawing", medium: "Pencil on paper", tags: ["drawing", "sketch"] };
  }
  if (lower.includes("sculpt") || lower.includes("clay") || lower.includes("ceramic")) {
    return { title: autoTitle, category: "sculpture", tags: ["sculpture"] };
  }
  if (lower.includes("print") || lower.includes("linocut") || lower.includes("etch")) {
    return { title: autoTitle, category: "printmaking", tags: ["printmaking"] };
  }
  if (lower.includes("digital") || lower.includes("cg") || lower.includes("3d") || lower.includes("render")) {
    return { title: autoTitle, category: "digital", medium: "Digital art", tags: ["digital art"] };
  }
  if (lower.includes("paint") || lower.includes("oil") || lower.includes("acrylic") || lower.includes("watercolor")) {
    let medium = "";
    if (lower.includes("oil")) medium = "Oil on canvas";
    else if (lower.includes("acrylic")) medium = "Acrylic on canvas";
    else if (lower.includes("watercolor") || lower.includes("watercolour")) medium = "Watercolor";
    return { title: autoTitle, category: "painting", medium, tags: ["painting"] };
  }
  return { title: autoTitle };
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateDetails(formData: ArtworkFormData): Partial<Record<keyof ArtworkFormData, string>> {
  const errors: Partial<Record<keyof ArtworkFormData, string>> = {};
  if (!formData.title.trim()) errors.title = "Title is required";
  if (formData.title.trim().length > 100) errors.title = "Title is too long (max 100 chars)";
  if (formData.description.length > 1000) errors.description = "Description is too long (max 1000 chars)";
  if (formData.widthStr && Number.isNaN(Number(formData.widthStr))) errors.widthStr = "Width must be a number";
  if (formData.heightStr && Number.isNaN(Number(formData.heightStr))) errors.heightStr = "Height must be a number";
  if (formData.yearStr) {
    const y = Number(formData.yearStr);
    if (Number.isNaN(y) || y < 1800 || y > new Date().getFullYear()) errors.yearStr = "Invalid year";
  }
  return errors;
}

// ── Step components ───────────────────────────────────────────────────────────

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

function Step1Upload({ imagePreviewUrl, aiState, uploadError, onFileSelect, onRemove }: Readonly<{
  imagePreviewUrl: string | null;
  aiState: "idle" | "analyzing" | "done";
  uploadError: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}>) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upload Your Artwork</h2>
      <p className="text-sm text-muted-foreground">
        Start by uploading a high-quality image of your artwork.
      </p>
      {imagePreviewUrl ? (
        <ImagePreview src={imagePreviewUrl} alt="Selected artwork" aspectRatio="4/3" onRemove={onRemove} />
      ) : (
        <FileUpload accept="image/jpeg,image/png,image/webp" maxSizeMb={15} onChange={onFileSelect} onError={() => {}} />
      )}
      {uploadError && <p className="text-sm text-destructive" role="alert">{uploadError}</p>}

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
  );
}

function Step2Details({ formData, formErrors, tagInput, aiFilledFields, onFormChange, onTagInputChange, onAddTag, onRemoveTag, onAiClear }: Readonly<{
  formData: ArtworkFormData;
  formErrors: Partial<Record<keyof ArtworkFormData, string>>;
  tagInput: string;
  aiFilledFields: Set<string>;
  onFormChange: (patch: Partial<ArtworkFormData>) => void;
  onTagInputChange: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onAiClear: (field: string) => void;
}>) {
  return (
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

      <FormField label="Title" htmlFor="title" error={formErrors.title} required>
        <div className="relative">
          <Input id="title" value={formData.title}
            onChange={(e) => { onFormChange({ title: e.target.value }); onAiClear("title"); }}
            placeholder="e.g. Sunset Over Tallinn"
            state={formErrors.title ? "error" : "default"} maxLength={100} />
          {aiFilledFields.has("title") && <AiBadge />}
        </div>
      </FormField>

      <FormField label="Description" htmlFor="description" error={formErrors.description}>
        <Textarea id="description" value={formData.description}
          onChange={(e) => onFormChange({ description: e.target.value })}
          placeholder="Describe your artwork, technique, inspiration..." rows={5} maxLength={1000} />
        <p className="text-right text-xs text-muted-foreground">{formData.description.length}/1000</p>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category">
          <div className="relative">
            <select id="category" value={formData.category}
              onChange={(e) => { onFormChange({ category: e.target.value }); onAiClear("category"); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}</option>
              ))}
            </select>
            {aiFilledFields.has("category") && <AiBadge />}
          </div>
        </FormField>
        <FormField label="Medium" htmlFor="medium">
          <div className="relative">
            <Input id="medium" value={formData.medium}
              onChange={(e) => { onFormChange({ medium: e.target.value }); onAiClear("medium"); }}
              placeholder="e.g. Oil on canvas" />
            {aiFilledFields.has("medium") && <AiBadge />}
          </div>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField label="Width" htmlFor="width" error={formErrors.widthStr}>
          <Input id="width" type="number" value={formData.widthStr}
            onChange={(e) => onFormChange({ widthStr: e.target.value })}
            placeholder="e.g. 60" state={formErrors.widthStr ? "error" : "default"} min={0} />
        </FormField>
        <FormField label="Height" htmlFor="height" error={formErrors.heightStr}>
          <Input id="height" type="number" value={formData.heightStr}
            onChange={(e) => onFormChange({ heightStr: e.target.value })}
            placeholder="e.g. 80" state={formErrors.heightStr ? "error" : "default"} min={0} />
        </FormField>
        <FormField label="Unit" htmlFor="unit">
          <select id="unit" value={formData.unit}
            onChange={(e) => onFormChange({ unit: e.target.value as "cm" | "in" | "m" })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="cm">cm</option>
            <option value="in">inches</option>
            <option value="m">m</option>
          </select>
        </FormField>
      </div>

      <FormField label="Year Created" htmlFor="year" error={formErrors.yearStr}>
        <Input id="year" type="number" value={formData.yearStr}
          onChange={(e) => onFormChange({ yearStr: e.target.value })}
          placeholder={String(new Date().getFullYear())}
          state={formErrors.yearStr ? "error" : "default"}
          min={1800} max={new Date().getFullYear()} />
      </FormField>

      <FormField label="Tags" htmlFor="tag-input" description="Add up to 10 tags to help people find your work.">
        <div className="flex gap-2">
          <Input id="tag-input" value={tagInput} onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddTag(); } }}
            placeholder="Add a tag and press Enter" />
          <Button type="button" variant="outline" onClick={onAddTag} size="md">Add</Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {aiFilledFields.has("tags") && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {tag}
                <button type="button" onClick={() => onRemoveTag(tag)} aria-label={`Remove ${tag}`}
                  className="ml-0.5 text-muted-foreground hover:text-destructive">×</button>
              </span>
            ))}
          </div>
        )}
      </FormField>
    </div>
  );
}

function Step3Publish({ imagePreviewUrl, formData, submitError, onFormChange }: Readonly<{
  imagePreviewUrl: string | null;
  formData: ArtworkFormData;
  submitError: string | null;
  onFormChange: (patch: Partial<ArtworkFormData>) => void;
}>) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review & Publish</h2>

      {imagePreviewUrl && (
        <div className="overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreviewUrl} alt="Artwork preview" className="aspect-[4/3] w-full object-cover" />
          <div className="p-4">
            <h3 className="font-semibold">{formData.title}</h3>
            {formData.medium && <p className="text-sm text-muted-foreground">{formData.medium}</p>}
            {formData.description && <p className="mt-2 line-clamp-3 text-sm text-foreground">{formData.description}</p>}
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
        <legend className="px-1 text-sm font-semibold">Publication Settings</legend>

        <div className="flex cursor-pointer items-center justify-between">
          <div className="flex items-start gap-2">
            <input id="show-on-profile" type="checkbox" checked={formData.showOnProfile}
              onChange={(e) => onFormChange({ showOnProfile: e.target.checked })}
              className="mt-1 h-4 w-4 rounded accent-primary" />
            <label htmlFor="show-on-profile" className="block cursor-pointer">
              <span className="text-sm font-medium">Show on public profile</span>
              <p className="text-xs text-muted-foreground">Visitors can see this artwork on your profile page</p>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Status</p>
          {(["draft", "published"] as const).map((status) => (
            <label key={status} className="flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={() => onFormChange({ status })}
                className="accent-primary"
                aria-label={status.charAt(0).toUpperCase() + status.slice(1)}
              />
              <div>
                <span className="text-sm font-medium capitalize">{status}</span>
                <p className="text-xs text-muted-foreground">
                  {status === "draft" ? "Save privately, publish later" : "Make visible to everyone now"}
                </p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {submitError && <p className="text-sm text-destructive" role="alert">{submitError}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function useArtworkPageState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [aiState, setAiState] = useState<"idle" | "analyzing" | "done">("idle");
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formData, setFormData] = useState<ArtworkFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ArtworkFormData, string>>>({});
  const [tagInput, setTagInput] = useState("");
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  return {
    currentStep, setCurrentStep,
    imageFile, setImageFile,
    imagePreviewUrl, setImagePreviewUrl,
    uploadError, setUploadError,
    aiState, setAiState,
    aiTimerRef,
    formData, setFormData,
    formErrors, setFormErrors,
    tagInput, setTagInput,
    aiFilledFields, setAiFilledFields,
    isSubmitting, setIsSubmitting,
    submitError, setSubmitError
  };
}

function useAiTimerCleanup(aiTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) {
  useEffect(() => () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); }, [aiTimerRef]);
}

function handleFileSelectFactory({
  setUploadError,
  setImageFile,
  imagePreviewUrl,
  setImagePreviewUrl,
  setAiState,
  aiTimerRef,
  setFormData,
  setAiFilledFields
}: any) {
  return (file: File) => {
    setUploadError(null);
    setImageFile(file);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(URL.createObjectURL(file));
    setAiState("analyzing");
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = setTimeout(() => {
      const meta = extractAiMetadata(file);
      setFormData((prev: ArtworkFormData) => ({ ...prev, ...meta }));
      setAiFilledFields(new Set(Object.keys(meta)));
      setAiState("done");
    }, 1200);
  };
}

export default function NewArtworkPage() {
  const router = useRouter();
  const state = useArtworkPageState();
  useAiTimerCleanup(state.aiTimerRef);

  const handleFileSelect = useCallback(
    handleFileSelectFactory({
      setUploadError: state.setUploadError,
      setImageFile: state.setImageFile,
      imagePreviewUrl: state.imagePreviewUrl,
      setImagePreviewUrl: state.setImagePreviewUrl,
      setAiState: state.setAiState,
      aiTimerRef: state.aiTimerRef,
      setFormData: state.setFormData,
      setAiFilledFields: state.setAiFilledFields
    }),
    [state.imagePreviewUrl]
  );
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
  }, [imagePreviewUrl]);

  const handleRemoveImage = useCallback(() => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    setAiState("idle");
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
  }, [imagePreviewUrl]);

  const handleFormChange = (patch: Partial<ArtworkFormData>) => setFormData((p) => ({ ...p, ...patch }));

  const handleAiClear = (field: string) => setAiFilledFields((s) => { const n = new Set(s); n.delete(field); return n; });

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  const handleNext = () => {
    if (currentStep === 0 && !imageFile) { setUploadError("Please select an image to upload"); return; }
    if (currentStep === 1) {
      const errors = validateDetails(formData);
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setCurrentStep((s) => s + 1);
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
      setSubmitError(err instanceof ApiError ? (err.detail ?? err.title ?? "Failed to save artwork") : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Add New Artwork</h1>
        <p className="mt-1 text-sm text-muted-foreground">Share your work with the world in three easy steps.</p>
      </div>

      <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

      {currentStep === 0 && (
        <Step1Upload
          imagePreviewUrl={imagePreviewUrl}
          aiState={aiState}
          uploadError={uploadError}
          onFileSelect={handleFileSelect}
          onRemove={handleRemoveImage}
        />
      )}
      {currentStep === 1 && (
        <Step2Details
          formData={formData}
          formErrors={formErrors}
          tagInput={tagInput}
          aiFilledFields={aiFilledFields}
          onFormChange={handleFormChange}
          onTagInputChange={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onAiClear={handleAiClear}
        />
      )}
      {currentStep === 2 && (
        <Step3Publish
          imagePreviewUrl={imagePreviewUrl}
          formData={formData}
          submitError={submitError}
          onFormChange={handleFormChange}
        />
      )}

      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <Button type="button" variant="ghost" disabled={isSubmitting}
          onClick={currentStep === 0 ? () => router.push("/dashboard/artworks") : () => setCurrentStep((s) => s - 1)}>
          {currentStep === 0 ? "Cancel" : "← Back"}
        </Button>

        {currentStep < 2 ? (
          <Button type="button" onClick={handleNext} disabled={currentStep === 0 && aiState === "analyzing"}>
            {currentStep === 0 && aiState === "analyzing" ? "AI analyzing..." : "Continue →"}
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
            {formData.status === "published" ? "Publish Artwork" : "Save as Draft"}
          </Button>
        )}
      </div>
    </div>
  );
}
