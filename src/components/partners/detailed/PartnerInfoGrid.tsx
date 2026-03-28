import React from "react";
import TextInput from "@/lib/ui/TextInput";
import TextareaInput from "@/lib/ui/TextareaInput";
import type { Partner } from "@/types/partner.types";
import "./PartnerInfoGrid.scss";

interface PartnerInfoGridProps {
  partner: Partner;
  isEditing: boolean;
  isAdmin: boolean;
  editForm: Partial<Partner>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

export function PartnerInfoGrid({
  partner,
  isEditing,
  isAdmin,
  editForm,
  onChange,
  errors,
}: PartnerInfoGridProps) {
  return (
    <>
      <div className="profile-grid">
        <div className="info-section">
          <h2>ზოგადი ინფორმაცია</h2>
          <TextInput
            id="identificationCode"
            label="საიდენტიფიკაციო კოდი"
            value={isEditing ? editForm.identificationCode || "" : partner.identificationCode}
            onChange={onChange}
            readOnly={!isAdmin}
            fullWidth
          />
          <TextInput
            id="contactPerson"
            label="საკონტაქტო პირი"
            value={isEditing ? editForm.contactPerson || "" : partner.contactPerson}
            onChange={onChange}
            readOnly={!isEditing}
            fullWidth
          />
          <div className="form-row">
            <TextInput
              id="city"
              label="ქალაქი"
              value={isEditing ? editForm.city || "" : partner.city}
              onChange={onChange}
              readOnly={!isEditing}
              fullWidth
            />
          </div>
          <TextInput
            id="address"
            label="მისამართი"
            value={isEditing ? editForm.address || "" : partner.address}
            onChange={onChange}
            readOnly={!isEditing}
            error={errors.address}
            fullWidth
          />
          <TextInput
            id="addressEn"
            label="მისამართი (ინგლისურად)"
            value={isEditing ? editForm.addressEn || "" : partner.addressEn}
            onChange={onChange}
            readOnly={!isEditing}
            error={errors.addressEn}
            fullWidth
          />
        </div>

        <div className="info-section">
          <h2>საკონტაქტო ინფორმაცია</h2>
          <TextInput
            id="phone"
            label="ტელეფონი"
            value={isEditing ? editForm.phone || "" : partner.phone}
            onChange={onChange}
            readOnly={!isEditing}
            error={errors.phone}
            fullWidth
          />
          <TextInput
            id="email"
            label="ელ. ფოსტა"
            value={isEditing ? editForm.email || "" : partner.email}
            onChange={onChange}
            readOnly={!isEditing}
            error={errors.email}
            fullWidth
          />
        </div>

        <div className="info-section social-links">
          <h2>სოციალური ბმულები</h2>
          <TextInput
            id="website"
            label="ვებ-საიტი"
            value={isEditing ? editForm.website || "" : partner.website || ""}
            onChange={onChange}
            readOnly={!isEditing}
            placeholder="https://example.com"
            fullWidth
          />
          <TextInput
            id="facebook"
            label="Facebook"
            value={isEditing ? editForm.facebook || "" : partner.facebook || ""}
            onChange={onChange}
            readOnly={!isEditing}
            placeholder="Facebook URL"
            fullWidth
          />
          <TextInput
            id="instagram"
            label="Instagram"
            value={isEditing ? editForm.instagram || "" : partner.instagram || ""}
            onChange={onChange}
            readOnly={!isEditing}
            placeholder="Instagram URL"
            fullWidth
          />
          <TextInput
            id="tiktok"
            label="TikTok"
            value={isEditing ? editForm.tiktok || "" : partner.tiktok || ""}
            onChange={onChange}
            readOnly={!isEditing}
            placeholder="TikTok URL"
            fullWidth
          />
        </div>
      </div>

      {(partner.description || partner.descriptionEn || isEditing) && (
        <div className="info-section description">
          <h2>აღწერა</h2>
          <TextareaInput
            id="description"
            label="აღწერა"
            value={(isEditing ? editForm.description : partner.description) || ""}
            onChange={onChange}
            readOnly={!isEditing}
            fullWidth
            rows={5}
          />
          <TextareaInput
            id="descriptionEn"
            label="აღწერა (ინგლისურად)"
            value={(isEditing ? editForm.descriptionEn : partner.descriptionEn) || ""}
            onChange={onChange}
            readOnly={!isEditing}
            fullWidth
            rows={5}
          />
        </div>
      )}
    </>
  );
}
