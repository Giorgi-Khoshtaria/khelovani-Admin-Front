export const AddressType = {
  Home: "home",
  Work: "work",
  Other: "other",
} as const;

export type AddressType = (typeof AddressType)[keyof typeof AddressType];

export interface UserAddress {
  _id: string;
  type: AddressType;
  label: string;
  addressLine: string;
  additionalComment?: string;
  lat: number;
  lng: number;
  formattedAddress?: string;
  isDefault: boolean;
  createdAt?: string;
}
