import TextInput from "@/lib/ui/TextInput";
import type { Partner } from "@/types/partner.types";
import "./PartnerCompanyPanel.scss";

interface PartnerCompanyPanelProps {
  partner: Partner;
  isEditing: boolean;
  editForm: Partial<Partner>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
}

export function PartnerCompanyPanel({
  partner,
  isEditing,
  editForm,
  onChange,
  errors,
}: PartnerCompanyPanelProps) {
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
              fullWidth
            />
          </div>
        ) : (
          <>
            <h2 className="company-title-ge">{partner.companyNameGe}</h2>
            <p className="company-title-en">({partner.companyNameEn})</p>
          </>
        )}
      </div>
    </div>
  );
}
