import { useEffect } from "react";
import type { MediaItem } from "@/types/media.types";
import {
  downloadUrl,
  formatBytes,
  formatDate,
  previewUrl,
} from "@/utils/mediaUtils";
import "./MediaLightbox.scss";

interface Props {
  item: MediaItem;
  orgName?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function MediaLightbox({
  item,
  orgName,
  onClose,
  onPrev,
  onNext,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = downloadUrl(item.url, item.name);
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="media-lightbox" onClick={onClose}>
      <div className="media-lightbox__actions">
        <button
          className="media-lightbox__action"
          title="გადმოწერა"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          ⬇
        </button>
        <button
          className="media-lightbox__action"
          title="დახურვა"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {onPrev && (
        <button
          className="media-lightbox__nav prev"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          ‹
        </button>
      )}

      <figure
        className="media-lightbox__figure"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={previewUrl(item.url)} alt={item.name} />
        <figcaption>
          <strong>{item.name}</strong>
          <span>
            {item.width}×{item.height} · {formatBytes(item.bytes)} ·{" "}
            {formatDate(item.createdAt)}
            {orgName ? ` · ${orgName}` : ""}
          </span>
        </figcaption>
      </figure>

      {onNext && (
        <button
          className="media-lightbox__nav next"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          ›
        </button>
      )}
    </div>
  );
}
