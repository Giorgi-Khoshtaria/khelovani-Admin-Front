import { PartnerStatus as PartnerStatusObj } from "@/types/partnerStatus";

export const PartnerTypeEnum = {
  ORGANIZATION: "organization",
  INDIVIDUAL: "individual",
} as const;

export type PartnerType = (typeof PartnerTypeEnum)[keyof typeof PartnerTypeEnum];

export type PartnerStatus =
  (typeof PartnerStatusObj)[keyof typeof PartnerStatusObj];

export interface PartnerData {
  _id: string;
  partnerType?: PartnerType;
  companyNameGe: string;
  companyNameEn?: string;
  email: string;
  status: PartnerStatus;
  identificationCode?: string;
  personalNumber?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  profilePhoto?: string;
  isPinned?: boolean;
  pinnedAt?: string | null;
  isShown?: boolean;
  createdAt: string;
}

export interface Partner {
  _id: string;
  partnerType?: PartnerType;
  companyNameGe: string;
  companyNameEn: string;
  identificationCode?: string;
  personalNumber?: string;
  contactPerson?: string;
  phone: string;
  city: string;
  email: string;
  address: string;
  addressEn: string;
  description?: string;
  descriptionEn?: string;
  status: PartnerStatus;
  createdAt: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  profilePhoto?: string;
  isPinned?: boolean;
  pinnedAt?: string | null;
  isShown?: boolean;
}
