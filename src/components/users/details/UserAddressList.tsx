import React from "react";
import "./UserAddressList.scss";
import { AddressType } from "@/types/address.types";
import type { UserAddress } from "@/types/address.types";

interface UserAddressListProps {
  addresses?: UserAddress[];
}

const TYPE_LABEL: Record<AddressType, string> = {
  [AddressType.Home]: "სახლი / Home",
  [AddressType.Work]: "სამსახური / Work",
  [AddressType.Other]: "სხვა / Other",
};

export const UserAddressList: React.FC<UserAddressListProps> = ({
  addresses,
}) => {
  if (!addresses || addresses.length === 0) {
    return (
      <p className="user-address-list__empty">
        შენახული მისამართები არ აქვს / No saved addresses
      </p>
    );
  }

  return (
    <div className="user-address-list">
      {addresses.map((address) => (
        <div className="user-address-card" key={address._id}>
          <div className="user-address-card__top">
            <span className="user-address-card__type">
              {TYPE_LABEL[address.type] || address.type}
            </span>
            {address.isDefault && (
              <span className="user-address-card__default">
                ნაგულისხმევი / Default
              </span>
            )}
          </div>

          <h4 className="user-address-card__label">{address.label}</h4>
          <p className="user-address-card__line">{address.addressLine}</p>

          {address.formattedAddress && (
            <p className="user-address-card__resolved">
              {address.formattedAddress}
            </p>
          )}

          {address.additionalComment && (
            <p className="user-address-card__comment">
              {address.additionalComment}
            </p>
          )}

          <a
            className="user-address-card__map-link"
            href={`https://www.google.com/maps?q=${address.lat},${address.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            რუკაზე ნახვა / View on map
          </a>
        </div>
      ))}
    </div>
  );
};
