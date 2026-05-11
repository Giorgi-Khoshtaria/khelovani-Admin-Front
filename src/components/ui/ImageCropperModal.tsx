import React, { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { processImage } from "@/utils/imageProcessing";
import "./ImageCropperModal.scss";

interface ImageCropperModalProps {
  file: File;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (processed: File) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  file,
  aspect = 1,
  onCancel,
  onConfirm,
}) => {
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  // Defer revoke so React 18 StrictMode's unmount→remount cycle (and any
  // in-flight image loads inside react-easy-crop) don't see a dead URL.
  useEffect(() => {
    return () => {
      const url = imageUrl;
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    };
  }, [imageUrl]);

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setAreaPixels(areaPx);
  }, []);

  const handleConfirm = async () => {
    if (!areaPixels || busy) return;
    try {
      setBusy(true);
      const processed = await processImage(file, areaPixels);
      onConfirm(processed);
    } catch (err) {
      console.error("Image processing failed", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="img-cropper-overlay" role="dialog" aria-modal="true">
      <div className="img-cropper">
        <div className="img-cropper__header">
          <h3>სურათის რედაქტირება</h3>
          <button
            type="button"
            className="img-cropper__close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="img-cropper__stage">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="img-cropper__controls">
          <label className="img-cropper__zoom">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="img-cropper__actions">
          <button
            type="button"
            className="img-cropper__btn img-cropper__btn--cancel"
            onClick={onCancel}
            disabled={busy}
          >
            გაუქმება
          </button>
          <button
            type="button"
            className="img-cropper__btn img-cropper__btn--confirm"
            onClick={handleConfirm}
            disabled={busy || !areaPixels}
          >
            {busy ? "მუშავდება..." : "დადასტურება"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
