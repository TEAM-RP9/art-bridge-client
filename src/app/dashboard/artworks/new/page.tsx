"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
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
import { createArtwork, uploadMedia, normalizeMediaUrl, ApiError } from "@/api";
import type { CreateArtworkRequest } from "@/api";
import { useAuth } from "@/auth";

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
  if (formData.description.length > 500) errors.description = "Description is too long (max 500 chars)";
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

function Step1Upload({ imagePreviewUrl, aiState, uploadError, uploadStatus, onFileSelect, onRemove }: Readonly<{
  imagePreviewUrl: string | null;
  aiState: "idle" | "analyzing" | "done";
  uploadError: string | null;
  uploadStatus: "idle" | "uploading" | "uploaded" | "error";
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

      {uploadStatus === "uploading" && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
          <svg className="h-4 w-4 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Uploading image...</span>
          </p>
        </div>
      )}

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
          placeholder="Describe your artwork, technique, inspiration..." rows={5} maxLength={500} />
        <p className="text-right text-xs text-muted-foreground">{formData.description.length}/500</p>
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
          <Image src={imagePreviewUrl} alt="Artwork preview" fill unoptimized className="object-cover" />
          <div className="p-4 space-y-2">
            <h3 className="font-semibold">{formData.title}</h3>
            {formData.medium && <p className="text-sm text-muted-foreground">{formData.medium}{formData.yearStr ? ` · ${formData.yearStr}` : ""}</p>}
            {!formData.medium && formData.yearStr && <p className="text-sm text-muted-foreground">{formData.yearStr}</p>}
            {formData.description && <p className="line-clamp-3 text-sm text-foreground">{formData.description}</p>}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.category && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                  {formData.category.replace("-", " ")}
                </span>
              )}
              {(formData.widthStr || formData.heightStr) && (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                  {formData.widthStr} × {formData.heightStr} {formData.unit}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <fieldset className="space-y-4 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold">Publication Settings</legend>

        <div className="flex items-center justify-between gap-4">
          <div>
            <span id="label-show-on-profile" className="text-sm font-medium">Show on public profile</span>
            <p className="text-xs text-muted-foreground">Visitors can see this artwork on your profile page</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.showOnProfile}
            aria-labelledby="label-show-on-profile"
            onClick={() => onFormChange({ showOnProfile: !formData.showOnProfile })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${formData.showOnProfile ? "bg-primary" : "bg-input"}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${formData.showOnProfile ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <span id="label-publish-now" className="text-sm font-medium">Publish now</span>
            <p className="text-xs text-muted-foreground">
              {formData.status === "published" ? "Make visible to everyone now" : "Save privately, publish later"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formData.status === "published"}
            aria-labelledby="label-publish-now"
            onClick={() => onFormChange({ status: formData.status === "published" ? "draft" : "published" })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${formData.status === "published" ? "bg-primary" : "bg-input"}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${formData.status === "published" ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </fieldset>

      {submitError && <p className="text-sm text-destructive" role="alert">{submitError}</p>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewArtworkPage() {
  const router = useRouter();
  const { user, isInitializing } = useAuth();
  const isArtist = user?.role === "ARTIST";
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
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const uploadIdRef = useRef(0);
  const uploadAbortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); }, []);

  useEffect(() => {
    if (!isInitializing && !isArtist) {
      router.replace("/dashboard/artworks");
    }
  }, [isArtist, isInitializing, router]);

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadError(null);
    setImageFile(file);

    // revoke previous blob URL safely
    if (blobUrl) URL.revokeObjectURL(blobUrl);

    const newBlobUrl = URL.createObjectURL(file);
    setBlobUrl(newBlobUrl);
    setImagePreviewUrl(newBlobUrl);

    setUploadStatus("uploading");
    setMediaId(null);

    setAiState("analyzing");

    const currentUploadId = ++uploadIdRef.current;
    uploadAbortRef.current?.abort();
    const controller = new AbortController();
    uploadAbortRef.current = controller;

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

    try {
      const result = await uploadMedia(file, { signal: controller.signal });

      // ignore stale uploads
      if (uploadIdRef.current !== currentUploadId) return;

      setMediaId(result.id);

      // revoke blob after success
      if (newBlobUrl) URL.revokeObjectURL(newBlobUrl);
      setBlobUrl(null);

      setImagePreviewUrl(normalizeMediaUrl(result.url));
      setUploadStatus("uploaded");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (uploadIdRef.current !== currentUploadId) return;

      setUploadStatus("error");
      setUploadError(
          err instanceof ApiError
              ? (err.detail ?? err.title ?? "Upload failed")
              : "Upload failed. Please try again."
      );
    }
  }, [blobUrl]);

  const handleRemoveImage = useCallback(() => {
    // cancel in-flight upload
    uploadIdRef.current++;
    uploadAbortRef.current?.abort();

    // revoke only blob URLs
    if (blobUrl) URL.revokeObjectURL(blobUrl);

    setImageFile(null);
    setImagePreviewUrl(null);
    setAiState("idle");
    setUploadStatus("idle");
    setMediaId(null);
    setBlobUrl(null);

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
  }, [blobUrl]);

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
    if (currentStep === 0) {
      if (!imageFile) { setUploadError("Please select an image to upload"); return; }
      if (uploadStatus === "uploading") { setUploadError("Please wait for the upload to complete"); return; }
      if (uploadStatus !== "uploaded") { setUploadError("Upload failed. Please try a different image."); return; }
    }
    if (currentStep === 1) {
      const errors = validateDetails(formData);
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!mediaId) return;
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
        unit: (formData.widthStr || formData.heightStr) ? formData.unit : undefined,
        year: formData.yearStr ? Number(formData.yearStr) : undefined,
        tags: formData.tags,
        status: formData.status,
        showOnProfile: formData.showOnProfile,
        mediaId,
      };
      await createArtwork(payload);
      router.push("/dashboard/artworks");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? (err.detail ?? err.title ?? "Failed to save artwork") : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing || !isArtist) {
    return null;
  }

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
          uploadStatus={uploadStatus}
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
          <Button type="button" onClick={handleNext} disabled={currentStep === 0 && (uploadStatus === "uploading" || aiState === "analyzing")}>
            {currentStep === 0 && uploadStatus === "uploading" ? "Uploading..." : currentStep === 0 && aiState === "analyzing" ? "AI analyzing..." : "Continue →"}
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
