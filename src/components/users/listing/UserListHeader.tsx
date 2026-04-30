import React, { useRef, useEffect } from "react";
import "./UserListHeader.scss";

interface UserListHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({
  allSelected,
  someSelected,
  onToggleAll,
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <div className="user-list-header">
      <div
        className="user-col-check"
        onClick={(e) => e.stopPropagation()}
        data-testid="select-all-cell"
      >
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          data-testid="select-all-checkbox"
          aria-label="ყველას მონიშვნა"
        />
      </div>
      <div className="user-col-id">ID</div>
      <div className="user-col-name">სახელი</div>
      <div className="user-col-email">ელ-ფოსტა</div>
      <div className="user-col-created">შექმნილია</div>
      <div className="user-col-actions">მოქმედება</div>
    </div>
  );
};
