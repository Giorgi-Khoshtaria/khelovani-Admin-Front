export const PartnerStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  BANNED: "BANNED",
} as const;

export type PartnerStatus = (typeof PartnerStatus)[keyof typeof PartnerStatus];

