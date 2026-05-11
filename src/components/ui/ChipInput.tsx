import React, { useState, type KeyboardEvent } from "react";
import "./ChipInput.scss";

interface ChipInputProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  max?: number;
  error?: boolean;
}

const ChipInput: React.FC<ChipInputProps> = ({
  items,
  onItemsChange,
  placeholder = "",
  addLabel = "+ დამატება",
  max,
  error,
}) => {
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const canAddMore = max == null || items.length < max;

  const addItem = () => {
    const value = draft.trim();
    if (!value) return;
    if (!canAddMore) return;
    if (items.includes(value)) {
      setDraft("");
      return;
    }
    onItemsChange([...items, value]);
    setDraft("");
  };

  const removeItem = (idx: number) => {
    onItemsChange(items.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditingValue(items[idx]);
  };

  const commitEdit = () => {
    if (editingIndex == null) return;
    const value = editingValue.trim();
    if (!value) {
      removeItem(editingIndex);
    } else {
      const next = [...items];
      next[editingIndex] = value;
      onItemsChange(next);
    }
    setEditingIndex(null);
    setEditingValue("");
  };

  const onDraftKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && draft === "" && items.length > 0) {
      onItemsChange(items.slice(0, -1));
    }
  };

  const onEditKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  return (
    <div className={`chip-input${error ? " chip-input--error" : ""}`}>
      <div className="chip-input__chips">
        {items.map((item, idx) =>
          editingIndex === idx ? (
            <input
              key={`edit-${idx}`}
              autoFocus
              type="text"
              className="chip-input__edit"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={onEditKey}
            />
          ) : (
            <span key={`chip-${idx}`} className="chip-input__chip">
              <button
                type="button"
                className="chip-input__chip-text"
                onClick={() => startEdit(idx)}
                title="რედაქტირება"
              >
                {item}
              </button>
              <button
                type="button"
                className="chip-input__chip-remove"
                onClick={() => removeItem(idx)}
                aria-label="remove"
              >
                ×
              </button>
            </span>
          ),
        )}
      </div>

      <div className="chip-input__add-row">
        <input
          type="text"
          className="chip-input__draft"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onDraftKey}
          disabled={!canAddMore}
        />
        <button
          type="button"
          className="chip-input__add-btn"
          onClick={addItem}
          disabled={!canAddMore || draft.trim() === ""}
        >
          {addLabel}
        </button>
      </div>

      {max != null && (
        <div className="chip-input__counter">
          {items.length} / {max}
        </div>
      )}
    </div>
  );
};

export default ChipInput;
