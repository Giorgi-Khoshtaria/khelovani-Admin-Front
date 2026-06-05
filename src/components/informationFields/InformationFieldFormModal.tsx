import { useState } from "react";
import { toast } from "react-toastify";
import {
  INFORMATION_FIELD_TYPES,
  INFORMATION_FIELD_TYPE_LABELS,
  InformationFieldType,
  type InformationField,
  type InformationFieldPayload,
} from "@/types/informationField.types";
import {
  useInformationFieldForm,
  valueInputType,
} from "@/hooks/informationFields/useInformationFieldForm";
import { uploadImageRequest } from "@/apiCalls/uploadApiCalls";
import ModalShell from "./ModalShell";
import "./InformationFieldFormModal.scss";

interface Props {
  field: InformationField | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: InformationFieldPayload) => void;
}

export default function InformationFieldFormModal({
  field,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = Boolean(field);
  const form = useInformationFieldForm(field);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.validate()) return;
    onSubmit(form.getPayload());
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageRequest(file);
      form.setValue(url);
      toast.success("ფაილი აიტვირთა");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("ფაილის ატვირთვა ვერ მოხერხდა");
    } finally {
      setUploading(false);
      // Allow re-selecting the same file.
      e.target.value = "";
    }
  };

  const busy = submitting || uploading;
  const isUpload = form.type === InformationFieldType.Upload;

  return (
    <ModalShell
      title={isEdit ? "ველის რედაქტირება" : "ახალი ველის დამატება"}
      onClose={onClose}
      variant="form"
    >
      <form className="if-form" onSubmit={handleSubmit}>
        <div className="if-form__group">
          <label htmlFor="if-key">გასაღები (key)</label>
          <input
            id="if-key"
            type="text"
            value={form.key}
            placeholder="მაგ: facebook_icon"
            onChange={(e) => form.setKey(e.target.value)}
            disabled={busy}
          />
          {form.errors.key && (
            <span className="if-form__error">{form.errors.key}</span>
          )}
        </div>

        <div className="if-form__group">
          <label htmlFor="if-type">ტიპი</label>
          <select
            id="if-type"
            value={form.type}
            onChange={(e) =>
              form.changeType(e.target.value as InformationFieldType)
            }
            disabled={busy}
          >
            {INFORMATION_FIELD_TYPES.map((t) => (
              <option key={t} value={t}>
                {INFORMATION_FIELD_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="if-form__group">
          <label htmlFor="if-value">
            {isUpload ? "ფაილი" : "მნიშვნელობა"}
          </label>

          {isUpload ? (
            <div className="if-upload">
              {form.value && (
                <div className="if-upload__preview">
                  <img src={form.value} alt="preview" />
                  <a href={form.value} target="_blank" rel="noreferrer">
                    {form.value}
                  </a>
                </div>
              )}
              <label className="if-upload__dropzone">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  disabled={busy}
                  hidden
                />
                <span>
                  {uploading
                    ? "იტვირთება..."
                    : form.value
                      ? "ფაილის შეცვლა"
                      : "ატვირთე ფაილი"}
                </span>
              </label>
            </div>
          ) : (
            <input
              id="if-value"
              type={valueInputType(form.type)}
              value={form.value}
              placeholder="მნიშვნელობა"
              onChange={(e) => form.setValue(e.target.value)}
              disabled={busy}
            />
          )}

          {form.errors.value && (
            <span className="if-form__error">{form.errors.value}</span>
          )}
        </div>

        <div className="if-form__group">
          <label htmlFor="if-desc">აღწერა (არასავალდებულო)</label>
          <textarea
            id="if-desc"
            rows={3}
            value={form.description}
            placeholder="მოკლე აღწერა"
            onChange={(e) => form.setDescription(e.target.value)}
            disabled={busy}
          />
          {form.errors.description && (
            <span className="if-form__error">{form.errors.description}</span>
          )}
        </div>

        <div className="if-form__footer">
          <button
            type="button"
            className="modal-btn modal-btn--secondary"
            onClick={onClose}
            disabled={busy}
          >
            გაუქმება
          </button>
          <button
            type="submit"
            className="modal-btn modal-btn--primary"
            disabled={busy}
          >
            {submitting ? "ინახება..." : isEdit ? "შენახვა" : "დამატება"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
