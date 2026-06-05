/**
 * Supported value types for an information field.
 * Keep this enum in sync with the backend
 * (khelovani-Web-admin-Back/src/modules/informationField.modules.ts).
 */
export const InformationFieldType = {
  Text: "text",
  Number: "number",
  Date: "date",
  Upload: "upload",
} as const;

export type InformationFieldType =
  (typeof InformationFieldType)[keyof typeof InformationFieldType];

export const INFORMATION_FIELD_TYPES = Object.values(InformationFieldType);

export const INFORMATION_FIELD_TYPE_LABELS: Record<
  InformationFieldType,
  string
> = {
  [InformationFieldType.Text]: "ტექსტი",
  [InformationFieldType.Number]: "რიცხვი",
  [InformationFieldType.Date]: "თარიღი",
  [InformationFieldType.Upload]: "ფაილი",
};

export interface InformationField {
  _id: string;
  key: string;
  type: InformationFieldType;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InformationFieldFilters {
  search?: string;
  type?: InformationFieldType | "all";
  page?: number;
  limit?: number;
}

export interface InformationFieldMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface InformationFieldPayload {
  key: string;
  type: InformationFieldType;
  value: string;
  description?: string;
}
