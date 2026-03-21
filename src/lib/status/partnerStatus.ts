export const PartnerStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type PartnerStatus = (typeof PartnerStatus)[keyof typeof PartnerStatus];
