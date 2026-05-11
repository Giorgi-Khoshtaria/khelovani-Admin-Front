import { useState } from "react";
import TextInput from "@/components/ui/TextInput";
import type { Partner } from "@/types/partner.types";
import { toast } from "react-toastify";
import ImageCropperModal from "@/components/ui/ImageCropperModal";
import "./PartnerCompanyPanel.scss";

interface PartnerCompanyPanelProps {
  partner: Partner;
  isEditing: boolean;
  editForm: Partial<Partner>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
  isOwnProfile?: boolean;
  onPhotoChange?: (file: File) => void;
}

export function PartnerCompanyPanel({
  partner,
  isEditing,
  editForm,
  onChange,
  errors,
  isOwnProfile,
  onPhotoChange,
}: PartnerCompanyPanelProps) {
  const handlePhotoClick = () => {
    if (isOwnProfile) {
      document.getElementById("company-photo-input")?.click();
    }
  };

  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.warning("მხოლოდ სურათების ატვირთვაა ნებადართული");
        return;
      }
      setPendingFile(file);
    }
  };

  return (
    <div className="company-info-panel">
      <div className="company-logo">
        {partner.companyNameGe.charAt(0).toUpperCase()}
      </div>
      <div className="company-text">
        {isEditing ? (
          <div className="edit-company-names">
            <TextInput
              id="companyNameGe"
              label="კომპანიის სახელი (GE)"
              value={editForm.companyNameGe || ""}
              onChange={onChange}
              error={errors.companyNameGe}
              fullWidth
            />
            <TextInput
              id="companyNameEn"
              label="კომპანიის სახელი (EN)"
              value={editForm.companyNameEn || ""}
              onChange={onChange}
              error={errors.companyNameEn}
              fullWidth
            />
          </div>
        ) : (
          <>
            <h1 className="company-title-ge">{partner.companyNameGe}</h1>
            <p className="company-title-en">({partner.companyNameEn})</p>
          </>
        )}
      </div>

      <div
        className={`company-photo-box ${isOwnProfile ? "can-edit" : ""}`}
        onClick={handlePhotoClick}
      >
        {partner.profilePhoto ? (
          <img
            src={partner.profilePhoto}
            alt="Company Logo"
            className="actual-photo"
          />
        ) : (
          <div className="photo-placeholder">
            <span>ფოტოს დამატება</span>
          </div>
        )}
        {isOwnProfile && (
          <div className="photo-edit-overlay">
            <span>შეცვლა</span>
          </div>
        )}
        <input
          type="file"
          id="company-photo-input"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {pendingFile && (
        <ImageCropperModal
          file={pendingFile}
          aspect={1}
          onCancel={() => setPendingFile(null)}
          onConfirm={(processed) => {
            setPendingFile(null);
            onPhotoChange?.(processed);
          }}
        />
      )}
    </div>
  );
}
