export const PartnerStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  BANNED: "banned",
} as const;

export type PartnerStatus = typeof PartnerStatus[keyof typeof PartnerStatus];

