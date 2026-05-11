import React, { useEffect, useMemo, useRef } from "react";
import "./MediaSection.scss";
import type { CreateProductInput } from "@/types/productTypes";
import ImageCropperModal from "../../../ui/ImageCropperModal";
import { useImageCropper } from "@/hooks/useImageCropper";

const ImageThumb: React.FC<{ file: File; onRemove: () => void; index: number }> = ({
  file,
  onRemove,
  index,
}) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => {
    return () => {
      const u = url;
      setTimeout(() => URL.revokeObjectURL(u), 2000);
    };
  }, [url]);
  return (
    <div className="pf-image-previews__item">
      <img src={url} alt={`upload-${index}`} />
      <button
        type="button"
        className="pf-image-previews__remove"
        onClick={onRemove}
        aria-label="Remove"
      >
        ×
      </button>
    </div>
  );
};

interface MediaSectionProps {
  images: CreateProductInput["images"];
  errors: Record<string, string>;
  isEdit?: boolean;
  existingImages?: string[];
  appendProcessedImage: (file: File) => void;
  resetImages: () => void;
  removeExistingImage?: (url: string) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  images,
  errors,
  isEdit,
  existingImages,
  appendProcessedImage,
  resetImages,
  removeExistingImage,
}) => {
  const cropper = useImageCropper();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const picked = Array.from(e.target.files);
    const remaining = Math.max(0, 5 - images.length);
    if (remaining === 0) return;
    cropper.enqueue(picked.slice(0, remaining));
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    resetImages();
    next.forEach(appendProcessedImage);
  };

  return (
    <div className="pf-card">
      <div className="pf-card__header">
        <div className="pf-card__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div>
          <h3 className="pf-card__title">მედია</h3>
          <p className="pf-card__subtitle">პროდუქტის სურათები (მაქს. 5)</p>
        </div>
      </div>

      <label className="upload-zone" htmlFor="pf-images">
        <div className="upload-zone__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="upload-zone__title">
          {isEdit ? "ახალი სურათების ასატვირთად დააჭირეთ" : "სურათების ასატვირთად დააჭირეთ"}
        </p>
        <p className="upload-zone__hint">PNG · JPG · WEBP &nbsp;·&nbsp; მაქს. 5 ფაილი</p>
        {isEdit && (
          <p className="upload-zone__note">ცარიელი დატოვება = ძველი სურათები შენარჩუნდება</p>
        )}
        <input
          id="pf-images"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onFilePicked}
          className="upload-zone__input"
        />
      </label>
      {errors.images && <span className="pf-error">{errors.images}</span>}

      {images.length > 0 && (
        <div className="pf-image-previews">
          {images.map((file, idx) => (
            <ImageThumb
              key={`${file.name}-${file.lastModified}-${idx}`}
              file={file}
              index={idx}
              onRemove={() => removeImage(idx)}
            />
          ))}
        </div>
      )}

      {cropper.current && (
        <ImageCropperModal
          file={cropper.current}
          aspect={4 / 5}
          onCancel={cropper.cancelCurrent}
          onConfirm={(processed) =>
            cropper.confirmCurrent(processed, appendProcessedImage)
          }
        />
      )}

      {isEdit && existingImages && existingImages.length > 0 && (
        <div className="existing-images">
          <p className="existing-images__title">არსებული სურათები</p>
          <div className="existing-images__grid">
            {existingImages.map((img, i) => (
              <div key={i} className="existing-images__thumb">
                <img src={img} alt={`product-${i}`} />
                {removeExistingImage && (
                  <button
                    type="button"
                    className="existing-images__remove"
                    onClick={() => removeExistingImage(img)}
                    aria-label="remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
