import React from "react";
import "./UserInfoForm.scss";
import type { User } from "@/types/user.types";

interface UserInfoFormProps {
  user: User;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ user }) => {
  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleString("ka-GE")
    : "";
  const dob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("ka-GE")
    : "";

  return (
    <form className="user-info-form" onSubmit={(e) => e.preventDefault()}>
      <div className="user-info-form__row">
        <div className="user-info-form__field">
          <label className="user-info-form__label">პირადი ნომერი / ID Number</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.idNumber}
            disabled
            readOnly
          />
        </div>
        <div className="user-info-form__field">
          <label className="user-info-form__label">ელ-ფოსტა / Email</label>
          <input
            type="email"
            className="user-info-form__input"
            value={user.email}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="user-info-form__row">
        <div className="user-info-form__field">
          <label className="user-info-form__label">სახელი (GE) / Name GE</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.nameGe || ""}
            disabled
            readOnly
          />
        </div>
        <div className="user-info-form__field">
          <label className="user-info-form__label">სახელი (EN) / Name EN</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.nameEn}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="user-info-form__row">
        <div className="user-info-form__field">
          <label className="user-info-form__label">ტელეფონი / Phone</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.phone}
            disabled
            readOnly
          />
        </div>
        <div className="user-info-form__field">
          <label className="user-info-form__label">დაბ. თარიღი / Date of Birth</label>
          <input
            type="text"
            className="user-info-form__input"
            value={dob}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="user-info-form__row">
        <div className="user-info-form__field">
          <label className="user-info-form__label">ქალაქი / City</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.city}
            disabled
            readOnly
          />
        </div>
        <div className="user-info-form__field">
          <label className="user-info-form__label">მისამართი / Address</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.address}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="user-info-form__row">
        <div className="user-info-form__field">
          <label className="user-info-form__label">სტატუსი / Status</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.isActive ? "აქტიური / Active" : "დეაქტივირებული / Inactive"}
            disabled
            readOnly
          />
        </div>
        <div className="user-info-form__field">
          <label className="user-info-form__label">ვერიფიკაცია / Verified</label>
          <input
            type="text"
            className="user-info-form__input"
            value={user.isVerified ? "დადასტურებული / Verified" : "დაუდასტურებელი / Unverified"}
            disabled
            readOnly
          />
        </div>
      </div>

      <div className="user-info-form__row">
        <div className="user-info-form__field">
          <label className="user-info-form__label">შექმნილია / Created At</label>
          <input
            type="text"
            className="user-info-form__input"
            value={createdAt}
            disabled
            readOnly
          />
        </div>
      </div>

      <p className="user-info-form__note">
        ადმინი ვერ არედაქტირებს მომხმარებლის მონაცემებს.
      </p>
    </form>
  );
};
