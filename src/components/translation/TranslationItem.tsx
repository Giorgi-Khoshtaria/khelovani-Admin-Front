
interface TranslationItemProps {
  translationKey: string;
  values: { ge: string; en: string };
  isEditing: boolean;
  editGe: string;
  setEditGe: (value: string) => void;
  editEn: string;
  setEditEn: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  checked: boolean;
  onSelect: (checked: boolean) => void;
}

export default function TranslationItem({
  translationKey,
  values,
  isEditing,
  editGe,
  setEditGe,
  editEn,
  setEditEn,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  checked,
  onSelect,
}: TranslationItemProps) {
  return (
    <div className={`item-row ${checked ? "selected" : ""}`}>
      <div className="col col-checkbox">
        <input type="checkbox" checked={checked} onChange={(e) => onSelect(e.target.checked)} />
      </div>
      <div className="col col-key">{translationKey}</div>
      <div className="col">
        {isEditing ? (
          <input
            type="text"
            value={editGe}
            onChange={(e) => setEditGe(e.target.value)}
          />
        ) : (
          values.ge
        )}
      </div>
      <div className="col">
        {isEditing ? (
          <input
            type="text"
            value={editEn}
            onChange={(e) => setEditEn(e.target.value)}
          />
        ) : (
          values.en
        )}
      </div>
      <div className="col actions">
        {isEditing ? (
          <div className="edit-actions">
            <button className="save-btn" onClick={onSave}>
              შენახვა
            </button>
            <button className="cancel-btn" onClick={onCancel}>
              გაუქმება
            </button>
          </div>
        ) : (
          <div className="row-actions">
            <button className="edit-btn" onClick={onEdit}>
              რედაქტირება
            </button>
            <button className="delete-btn" onClick={onDelete}>
              წაშლა
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
