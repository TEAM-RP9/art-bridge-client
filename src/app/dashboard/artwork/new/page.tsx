"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { ApiError, normalizeMediaUrl, uploadMedia } from "@/api";
import { ImageDropzone, Stepper, type UploadState } from "@/components/common";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Heading,
  Paragraph,
  buttonVariants,
} from "@/components/ui";
import { cn } from "@/lib/utils";

type Action =
  | { type: "HYDRATED"; url: string | null }
  | { type: "DRAG_ENTER" }
  | { type: "DRAG_LEAVE" }
  | { type: "UPLOAD_START"; fileName: string }
  | { type: "UPLOAD_SUCCESS"; previewUrl: string; remoteUrl: string }
  | { type: "UPLOAD_ERROR"; message: string }
  | { type: "VALIDATION_ERROR"; message: string };

function reducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case "HYDRATED":
      if (action.url) {
        return { status: "uploaded", previewUrl: action.url, remoteUrl: action.url };
      }
      return { status: "idle" };

    case "DRAG_ENTER":
      if (state.status === "uploading") return state;
      return { status: "dragging" };

    case "DRAG_LEAVE":
      if (state.status !== "dragging") return state;
      return { status: "idle" };

    case "UPLOAD_START":
      return { status: "uploading", fileName: action.fileName };

    case "UPLOAD_SUCCESS":
      return {
        status: "uploaded",
        previewUrl: action.previewUrl,
        remoteUrl: action.remoteUrl,
      };

    case "UPLOAD_ERROR":
    case "VALIDATION_ERROR":
      return { status: "error", message: action.message };

    default:
      return state;
  }
}

const STEPS = [
  { label: "Upload" },
  { label: "Details" },
  { label: "Review" },
];

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg"]);
const MAX_SIZE = 10 * 1024 * 1024;
const SESSION_KEY = "artwork-draft-image-url";

export default function AddArtworkPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [state, dispatch] = React.useReducer(reducer, { status: "hydrating" });
  const abortRef = React.useRef<AbortController | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login?next=/dashboard/artwork/new");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) {
      dispatch({ type: "HYDRATED", url: null });
      return;
    }

    const normalizedUrl = normalizeMediaUrl(saved);
    if (normalizedUrl !== saved) {
      sessionStorage.setItem(SESSION_KEY, normalizedUrl);
    }
    dispatch({ type: "HYDRATED", url: normalizedUrl });
  }, []);

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length > 1) {
      revokeObjectUrl();
      dispatch({ type: "VALIDATION_ERROR", message: "Please upload one image at a time." });
      return;
    }

    const file = files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      revokeObjectUrl();
      dispatch({ type: "VALIDATION_ERROR", message: "Only PNG and JPG files are allowed." });
      return;
    }

    if (file.size > MAX_SIZE) {
      revokeObjectUrl();
      dispatch({ type: "VALIDATION_ERROR", message: "Image must be 10MB or smaller." });
      return;
    }

    revokeObjectUrl();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "UPLOAD_START", fileName: file.name });

    uploadMedia(file, { signal: controller.signal })
      .then((result) => {
        const remoteUrl = normalizeMediaUrl(result.url);
        sessionStorage.setItem(SESSION_KEY, remoteUrl);
        dispatch({ type: "UPLOAD_SUCCESS", previewUrl, remoteUrl });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        revokeObjectUrl();
        const message =
          error instanceof ApiError && error.detail
            ? error.detail
            : "Upload failed. Please try again.";
        dispatch({ type: "UPLOAD_ERROR", message });
      });
  };

  const handleDragEnter = () => dispatch({ type: "DRAG_ENTER" });
  const handleDragLeave = () => dispatch({ type: "DRAG_LEAVE" });

  const handleNext = () => {};

  const isUploaded = state.status === "uploaded";

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost" }), "-ml-2")}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Stepper steps={STEPS} current={1} />

        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Heading level="h2" className="text-xl font-semibold md:text-2xl">
                Upload Your Artwork
              </Heading>
              <Paragraph size="sm" color="muted">
                Add a high-quality image of your artwork. This will be the main visual on your
                profile and listings.
              </Paragraph>
            </div>

            <ImageDropzone
              state={state}
              onFiles={handleFiles}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            />
          </CardContent>

          <CardFooter className="justify-between">
            <Button variant="outline" disabled>
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>
            <Button disabled={!isUploaded} onClick={handleNext}>
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}
