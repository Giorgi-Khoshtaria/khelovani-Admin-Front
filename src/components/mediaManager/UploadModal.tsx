import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { MediaItem, MediaOrganization } from "@/types/media.types";
import { uploadMediaRequest } from "@/apiCalls/mediaApiCalls";
import { formatBytes } from "@/utils/mediaUtils";
import "./UploadModal.scss";

interface Props {
  isAdmin: boolean;
  organizations: MediaOrganization[];
  presetOrgId?: string;
  onClose: () => void;
  onUploaded: (items: MediaItem[]) => void;
}

const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB — matches backend multer limit
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function UploadModal({
  isAdmin,
  organizations,
  presetOrgId,
  onClose,
  onUploaded,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [orgId, setOrgId] = useState(presetOrgId || "");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addFiles = (incoming: FileList | File[]) => {
    const valid: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!ALLOWED.includes(file.type)) {
        toast.error(`${file.name}: დაუშვებელი ფორმატი`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: ფაილი 5MB-ზე დიდია`);
        continue;
      }
      valid.push(file);
    }
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (isAdmin && !orgId) {
      toast.error("აირჩიეთ ორგანიზაცია");
      return;
    }
    setProgress(0);
    try {
      const items = await uploadMediaRequest(
        files,
        isAdmin ? orgId : undefined,
        setProgress,
      );
      toast.success(`${items.length} ფაილი აიტვირთა`);
      onUploaded(items);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "ატვირთვა ვერ მოხერხდა");
      setProgress(null);
    }
  };

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal" onClick={(e) => e.stopPropagation()}>
        <div className="media-modal__header">
          <h3>ფაილების ატვირთვა</h3>
          <button className="media-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="media-modal__body">
          {isAdmin && (
            <label className="media-field">
              <span>ორგანიზაცია *</span>
              <select value={orgId} onChange={(e) => setOrgId(e.target.value)}>
                <option value="">— აირჩიეთ ორგანიზაცია —</option>
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div
            className={`upload-drop ${dragging ? "is-dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={ALLOWED.join(",")}
              hidden
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <p className="upload-drop__title">
              გადმოიტანეთ ფაილები ან დააწკაპუნეთ ასარჩევად
            </p>
            <p className="upload-drop__hint">
              JPG, PNG, WEBP · მაქს. 5MB · მაქს. {MAX_FILES} ფაილი
            </p>
          </div>

          {files.length > 0 && (
            <ul className="upload-list">
              {files.map((file, i) => (
                <li key={`${file.name}-${i}`}>
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                  <div className="upload-list__meta">
                    <span className="upload-list__name">{file.name}</span>
                    <span className="upload-list__size">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  {progress === null && (
                    <button
                      className="upload-list__remove"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {progress !== null && (
            <div className="upload-progress">
              <div
                className="upload-progress__bar"
                style={{ width: `${progress}%` }}
              />
              <span>{progress}%</span>
            </div>
          )}
        </div>

        <div className="media-modal__footer">
          <button
            className="btn-ghost"
            onClick={onClose}
            disabled={progress !== null}
          >
            გაუქმება
          </button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={files.length === 0 || progress !== null}
          >
            {progress !== null ? "იტვირთება..." : `ატვირთვა (${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
