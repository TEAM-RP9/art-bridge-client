"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common";
import {
  Button,
  Stepper,
  Card,
  CardContent,
  FormField,
  Input,
  Textarea,
  Switch
} from "@/components/ui";
import { CreateArtworkRequest } from "@/api/artworks";

const STEPS = [
  { title: "Upload", description: "Select your artwork file" },
  { title: "Details", description: "Add information about your work" },
  { title: "Review", description: "Finalize and publish" },
];

export default function NewArtworkPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateArtworkRequest>>({
    title: "",
    description: "",
    category: "",
    medium: "",
    dimensions: { width: 0, height: 0, unit: "cm" },
    yearCreated: new Date().getFullYear(),
    tags: [],
    status: "DRAFT",
    showOnProfile: true,
    imageUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // In a real app, this would be the URL from the server
          setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
        }
      }, 200);
    }
  };

  const handleSubmit = async () => {
    try {
      // await createArtwork(formData as CreateArtworkRequest);
      console.log("Submitting artwork:", formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create artwork:", error);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-8">
      <PageHeader
        title="Add New Artwork"
        subtitle="Share your latest creation with the community."
      />

      <Stepper steps={STEPS} currentStep={currentStep} />

      <Card>
        <CardContent className="pt-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div
                className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {formData.imageUrl ? (
                  <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg">
                    <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white">
                      Click to change
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">Click or drag to upload</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                />
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <FormField label="Title" required>
                <Input
                  placeholder="Artwork title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </FormField>
              <FormField label="Description" description="Tell us about the piece (max 500 chars)">
                <Textarea
                  placeholder="Describe your artwork..."
                  className="min-h-[120px]"
                  maxLength={500}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category">
                  <Input
                    placeholder="e.g. Abstract, Portrait"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </FormField>
                <FormField label="Medium">
                  <Input
                    placeholder="e.g. Oil on Canvas"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Width">
                  <Input
                    type="number"
                    value={formData.dimensions?.width}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, width: Number(e.target.value) }
                    })}
                  />
                </FormField>
                <FormField label="Height">
                  <Input
                    type="number"
                    value={formData.dimensions?.height}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, height: Number(e.target.value) }
                    })}
                  />
                </FormField>
                <FormField label="Unit">
                  <Input
                    placeholder="cm, in"
                    value={formData.dimensions?.unit}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: { ...formData.dimensions!, unit: e.target.value }
                    })}
                  />
                </FormField>
              </div>
              <FormField label="Year Created">
                <Input
                  type="number"
                  value={formData.yearCreated}
                  onChange={(e) => setFormData({ ...formData, yearCreated: Number(e.target.value) })}
                />
              </FormField>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-1/3 aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  <img src={formData.imageUrl} alt={formData.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{formData.title || "Untitled"}</h3>
                    <p className="text-muted-foreground">{formData.medium} • {formData.yearCreated}</p>
                  </div>
                  <p className="text-sm line-clamp-4">{formData.description || "No description provided."}</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.category && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                        {formData.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show on public profile</p>
                    <p className="text-sm text-muted-foreground">Make this artwork visible to everyone.</p>
                  </div>
                  <Switch
                    checked={formData.showOnProfile}
                    onCheckedChange={(checked) => setFormData({ ...formData, showOnProfile: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Publish Now</p>
                    <p className="text-sm text-muted-foreground">Set status to published immediately.</p>
                  </div>
                  <Switch
                    checked={formData.status === "PUBLISHED"}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "PUBLISHED" : "DRAFT" })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep === STEPS.length - 1 ? (
          <Button onClick={handleSubmit}>
            Publish Artwork
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={currentStep === 0 && !formData.imageUrl}>
            Next Step
          </Button>
        )}
      </div>
    </main>
  );
}

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);
