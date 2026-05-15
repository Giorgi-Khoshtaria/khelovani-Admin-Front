import React from "react";
import "./ProductFilters.scss";
import CategorySelect from "../../ui/CategorySelect";
import { PartnerTypeEnum, type PartnerType } from "@/types/partner.types";
import { CONDITION_LABELS, PRODUCT_CONDITIONS, type ProductCondition } from "@/types/productTypes";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  condition: ProductCondition | "";
  onConditionChange: (value: ProductCondition | "") => void;
  isAdmin: boolean;
  id?: string;
  selectedPartnerId: string;
  onPartnerChange: (value: string) => void;
  partners: { _id: string; name: string }[];
  ownerType: PartnerType | "";
  onOwnerTypeChange: (value: PartnerType | "") => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  condition,
  onConditionChange,
  isAdmin,
  id,
  selectedPartnerId,
  onPartnerChange,
  partners,
  ownerType,
  onOwnerTypeChange,
}) => {
  return (
    <div className="filters card">
      <div className="filters__row filters__row--search">
        <div className="filters__group filters__group--search">
          <div className="filters__search-wrapper">
            <svg
              className="filters__search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="ძიება (სათაური)"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="filters__input"
            />
          </div>
        </div>
      </div>

      <div className="filters__row filters__row--selects">
        {isAdmin && !id && (
          <div className="filters__group">
            <label className="filters__label">ორგანიზაცია</label>
            <div className="filters__select-wrapper">
              <svg
                className="filters__select-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <select
                className="filters__select"
                value={selectedPartnerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onPartnerChange(e.target.value)
                }
              >
                <option value="">ყველა ორგანიზაცია</option>
                {partners.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="filters__group">
            <label className="filters__label">მფლობელის ტიპი</label>
            <div className="filters__select-wrapper">
              <select
                className="filters__select"
                value={ownerType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onOwnerTypeChange(e.target.value as PartnerType | "")
                }
              >
                <option value="">ყველა მფლობელი</option>
                <option value={PartnerTypeEnum.ORGANIZATION}>🏢 კომპანია</option>
                <option value={PartnerTypeEnum.INDIVIDUAL}>👤 ბრენდი</option>
              </select>
            </div>
          </div>
        )}

        <div className="filters__group">
          <label className="filters__label">კატეგორია</label>
          <CategorySelect
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onCategoryChange(e.target.value)
            }
            includeAll={true}
            className="filters__category"
          />
        </div>

        <div className="filters__group">
          <label className="filters__label">მდგომარეობა</label>
          <div className="filters__select-wrapper">
            <select
              className="filters__select"
              value={condition}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onConditionChange(e.target.value as ProductCondition | "")
              }
            >
              <option value="">ყველა მდგომარეობა</option>
              {PRODUCT_CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {CONDITION_LABELS[c].ge}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
