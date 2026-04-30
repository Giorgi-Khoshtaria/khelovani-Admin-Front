import React from "react";
import "./UserTableRow.scss";
import type { User } from "@/types/user.types";

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, userId: string) => void;
  onRowClick: () => void;
}

const MAX_NAME_LENGTH = 20;

const getUserDisplayName = (user: User): string => {
  const name = user.nameGe || user.nameEn || "—";
  return name.length > MAX_NAME_LENGTH
    ? `${name.slice(0, MAX_NAME_LENGTH)}...`
    : name;
};

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  isSelected,
  onToggleSelect,
  onDelete,
  onRowClick,
}) => {
  const displayName = getUserDisplayName(user);
  const rawId = user.idNumber || user._id.slice(-8).toUpperCase();
  const shortId =
    rawId.length > MAX_NAME_LENGTH
      ? `${rawId.slice(0, MAX_NAME_LENGTH)}...`
      : rawId;
  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ka-GE")
    : "—";

  return (
    <div
      className={`user-row${isSelected ? " user-row--selected" : ""}`}
      onClick={onRowClick}
      data-testid="user-row"
    >
      <div
        className="user-col-check"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(user._id);
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(user._id)}
          data-testid="user-row-checkbox"
          aria-label="მომხმარებლის მონიშვნა"
        />
      </div>

      <div className="user-col-id">
        <span className="user-id-badge" title={user._id}>
          {shortId}
        </span>
      </div>

      <div className="user-col-name">
        <span className="user-name">{displayName}</span>
      </div>

      <div className="user-col-email">
        <span className="user-email">{user.email}</span>
      </div>

      <div className="user-col-created">
        <span className="user-created">{createdAt}</span>
      </div>

      <div className="user-col-actions" onClick={(e) => e.stopPropagation()}>
        <div className="user-action-buttons">
          <button
            className="user-action-btn user-delete-btn"
            onClick={(e) => onDelete(e, user._id)}
            title="წაშლა"
            data-testid="user-delete-btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
