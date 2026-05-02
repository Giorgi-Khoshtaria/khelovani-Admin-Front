import React from "react";
import TextInput from "@/components/ui/TextInput";
import TextareaInput from "@/components/ui/TextareaInput";
import SelectInput from "@/components/ui/SelectInput";
import MultiSelectChips from "@/components/ui/MultiSelectChips";
import { CITY_OPTIONS } from "@/components/ui/CityOptions";
import useCategoryOptions from "@/hooks/categories/useCategoryOptions";
import type { Partner } from "@/types/partner.types";
import "./PartnerInfoGrid.scss";

interface PartnerInfoGridProps {
  partner: Partner;
  isEditing: boolean;
  isAdmin: boolean;
  editForm: Partial<Partner>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onCategoriesChange?: (categories: string[]) => void;
  errors: Record<string, string>;
}

export function PartnerInfoGrid({
  partner,
  isEditing,
  isAdmin,
  editForm,
  onChange,
  onCategoriesChange,
  errors,
}: PartnerInfoGridProps) {
  const { options: catOptions, getLabel } = useCategoryOptions();
  return (
    <>
      <div className="profile-grid">
        <div className="info-section">
          <h2>ზოგადი ინფორმაცია</h2>
          {partner.partnerType === "individual" ? (
            <TextInput
              id="personalNumber"
              label="პირადი ნომერი"
              value={
                isEditing
                  ? editForm.personalNumber || ""
                  : partner.personalNumber || ""
              }
              onChange={onChange}
              readOnly={!isAdmin}
              error={errors.personalNumber}
              fullWidth
            />
          ) : (
            <TextInput
              id="identificationCode"
              label="საიდენტიფიკაციო კოდი"
              value={
                isEditing
                  ? editForm.identificationCode || ""
                  : partner.identificationCode || ""
              }
              onChange={onChange}
              readOnly={!isAdmin}
              error={errors.identificationCode}
              fullWidth
            />
          )}
          {partner.partnerType !== "individual" && (
            <TextInput
              id="contactPerson"
              label="საკონტაქტო პირი"
              value={
                isEditing ? editForm.contactPerson || "" : partner.contactPerson || ""
              }
              onChange={onChange}
              readOnly={!isEditing}
              error={errors.contactPerson}
              fullWidth
            />
          )}
          <div className="form-row">
            {isEditing ? (
              <SelectInput
                id="city"
                label="ქალაქი"
                value={editForm.city || ""}
                onChange={onChange}
                options={CITY_OPTIONS}
                error={errors.city}
                fullWidth
              />
            ) : (
              <TextInput
                id="city"
                label="ქალაქი"
                value={partner.city}
                onChange={onChange}
                readOnly={true}
                fullWidth
              />
            )}
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
            value={
              isEditing ? editForm.instagram || "" : partner.instagram || ""
            }
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

      <div className="info-section categories">
        <h2>კატეგორიები</h2>
        {isEditing ? (
          <MultiSelectChips
            options={catOptions.map((c) => ({ value: c.slug, label: c.nameGe }))}
            value={editForm.categories ?? []}
            onChange={(cats) => onCategoriesChange?.(cats)}
            placeholder="კატეგორია აირჩიეთ"
          />
        ) : (
          <div className="category-chips">
            {(partner.categories ?? []).length === 0 ? (
              <span className="category-chips__empty">კატეგორია არ არის მითითებული</span>
            ) : (
              (partner.categories ?? []).map((slug) => (
                <span key={slug} className="category-chips__chip">
                  {getLabel(slug)}
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {(partner.description || partner.descriptionEn || isEditing || isAdmin) && (
        <div className="info-section description">
          <h2>აღწერა</h2>
          <TextareaInput
            id="description"
            label="აღწერა"
            value={
              (isEditing ? editForm.description : partner.description) || ""
            }
            onChange={onChange}
            readOnly={!isEditing}
            fullWidth
            rows={5}
          />
          <TextareaInput
            id="descriptionEn"
            label="აღწერა (ინგლისურად)"
            value={
              (isEditing ? editForm.descriptionEn : partner.descriptionEn) || ""
            }
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
