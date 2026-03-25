import { PartnerStatus as PartnerStatusObj } from "@/lib/status/partnerStatus";

export type PartnerStatus =
  (typeof PartnerStatusObj)[keyof typeof PartnerStatusObj];

export interface PartnerData {
  _id: string;
  companyNameGe: string;
  companyNameEn?: string;
  email: string;
  status: PartnerStatus;
  identificationCode?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface Partner {
  _id: string;
  companyNameGe: string;
  companyNameEn: string;
  identificationCode: string;
  contactPerson: string;
  phone: string;
  city: string;
  email: string;
  address: string;
  addressEn: string;
  description?: string;
  status: PartnerStatus;
  createdAt: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}
