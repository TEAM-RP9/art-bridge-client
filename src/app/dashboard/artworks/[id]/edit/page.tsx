"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, FormField, Input, Textarea } from "@/components/ui";
import { getArtwork, updateArtwork, ApiError } from "@/api";
import type { ArtworkResponse, UpdateArtworkRequest } from "@/api";

interface EditPageProps {
  readonly params: Promise<{ id: string }>;
}

const CATEGORY_OPTIONS = [
  "painting", "drawing", "sculpture", "photography",
  "printmaking", "digital", "mixed-media", "other",
];

export default function EditArtworkPage({ params }: Readonly<EditPageProps>) {
  const { id } = use(params);
  const router = useRouter();
  const [artwork, setArtwork] = useState<ArtworkResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Form state — kept as strings so inputs stay controlled
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [medium, setMedium] = useState("");
  const [widthStr, setWidthStr] = useState("");
  const [heightStr, setHeightStr] = useState("");
  const [unit, setUnit] = useState<"cm" | "in" | "m">("cm");
  const [yearStr, setYearStr] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [showOnProfile, setShowOnProfile] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getArtwork(id)
      .then((data) => {
        if (cancelled) return;
        setArtwork(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setCategory(data.category ?? "");
        setMedium(data.medium ?? "");
        setWidthStr(data.width != null ? String(data.width) : "");
        setHeightStr(data.height != null ? String(data.height) : "");
        setUnit(data.unit ?? "cm");
        setYearStr(data.year != null ? String(data.year) : "");
        setTags(data.tags ?? []);
        setStatus(data.status);
        setShowOnProfile(data.showOnProfile);
      })
      .catch(() => router.push("/dashboard/artworks"))
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [id, router]);

  const validate = (): boolean => {
    const e: Partial<Record<string, string>> = {};
    if (!title.trim()) e.title = "Title is required";
    if (title.trim().length > 100) e.title = "Max 100 characters";
    if (widthStr && isNaN(Number(widthStr))) e.width = "Must be a number";
    if (heightStr && isNaN(Number(heightStr))) e.height = "Must be a number";
    if (yearStr) {
      const y = Number(yearStr);
      if (isNaN(y) || y < 1800 || y > new Date().getFullYear()) e.year = "Invalid year";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    setSaveError(null);
    const payload: UpdateArtworkRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      medium: medium.trim() || undefined,
      width: widthStr ? Number(widthStr) : undefined,
      height: heightStr ? Number(heightStr) : undefined,
      unit: (widthStr || heightStr) ? unit : undefined,
      year: yearStr ? Number(yearStr) : undefined,
      tags,
      status,
      showOnProfile,
    };
    try {
      await updateArtwork(id, payload);
      router.push(`/dashboard/artworks/${id}`);
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? (err.detail ?? err.title ?? "Failed to save")
          : "Something went wrong"
      );
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
    }
  };

  if (isLoading || !artwork) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-64 w-full rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href={`/dashboard/artworks/${id}`}
            className="mb-1 block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold">Edit Artwork</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/artworks/${id}`)}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <FormField label="Title" htmlFor="title" error={errors.title} required>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            state={errors.title ? "error" : "default"}
            maxLength={100}
          />
        </FormField>

        <FormField label="Description" htmlFor="description">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            maxLength={1000}
          />
          <p className="text-right text-xs text-muted-foreground">
            {description.length}/1000
          </p>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Category" htmlFor="category">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Medium" htmlFor="medium">
            <Input
              id="medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. Oil on canvas"
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Width" htmlFor="width" error={errors.width}>
            <Input
              id="width"
              type="number"
              value={widthStr}
              onChange={(e) => setWidthStr(e.target.value)}
              state={errors.width ? "error" : "default"}
              min={0}
            />
          </FormField>
          <FormField label="Height" htmlFor="height" error={errors.height}>
            <Input
              id="height"
              type="number"
              value={heightStr}
              onChange={(e) => setHeightStr(e.target.value)}
              state={errors.height ? "error" : "default"}
              min={0}
            />
          </FormField>
          <FormField label="Unit" htmlFor="unit">
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as "cm" | "in" | "m")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="cm">cm</option>
              <option value="in">inches</option>
              <option value="m">m</option>
            </select>
          </FormField>
        </div>

        <FormField label="Year" htmlFor="year" error={errors.year}>
          <Input
            id="year"
            type="number"
            value={yearStr}
            onChange={(e) => setYearStr(e.target.value)}
            state={errors.year ? "error" : "default"}
            min={1800}
            max={new Date().getFullYear()}
          />
        </FormField>

        <FormField label="Tags" htmlFor="tag-input"
          description="Up to 10 tags.">
          <div className="flex gap-2">
            <Input
              id="tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Type and press Enter"
            />
            <Button type="button" variant="outline" onClick={addTag}>Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => setTags((p) => p.filter((t) => t !== tag))}
                    aria-label={`Remove ${tag}`}
                    className="ml-0.5 text-muted-foreground hover:text-destructive">×</button>
                </span>
              ))}
            </div>
          )}
        </FormField>

        <fieldset className="space-y-4 rounded-xl border border-border p-4">
          <legend className="px-1 text-sm font-semibold">Publication</legend>

          <label className="flex cursor-pointer items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show on public profile</p>
            </div>
            <input type="checkbox" checked={showOnProfile}
              onChange={(e) => setShowOnProfile(e.target.checked)}
              className="h-4 w-4 rounded accent-primary" />
          </label>

          <div className="flex gap-6">
            {(["draft", "published"] as const).map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="status" value={s}
                  checked={status === s} onChange={() => setStatus(s)}
                  className="accent-primary" />
                <span className="text-sm font-medium capitalize">{s}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {saveError && (
          <p className="text-sm text-destructive" role="alert">{saveError}</p>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-6">
          <Button variant="outline" onClick={() => router.push(`/dashboard/artworks/${id}`)}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
