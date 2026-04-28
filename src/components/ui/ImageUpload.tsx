'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/api/media';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
}

export function ImageUpload({ onUpload, currentImageUrl }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const { url } = await uploadImage(file);
      setPreview(url);
      onUpload(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-teal-500 transition-colors disabled:opacity-50"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm text-gray-500">
            {uploading ? 'Uploading…' : 'Click to upload'}
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-sm">Uploading…</span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
