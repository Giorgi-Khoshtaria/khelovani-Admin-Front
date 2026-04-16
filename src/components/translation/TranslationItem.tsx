import "./TranslationItem.scss";

interface TranslationItemProps {
  translationKey: string;
  values: { ge: string; en: string };
  namespaceId?: string;
  namespaces: Array<{ _id: string; name: string }>;
  onEdit: () => void;
  onDelete: () => void;
  checked: boolean;
  onSelect: (checked: boolean) => void;
}

export default function TranslationItem({
  translationKey,
  values,
  namespaceId,
  namespaces,
  onEdit,
  onDelete,
  checked,
  onSelect,
}: TranslationItemProps) {
  const currentNamespaceName =
    namespaces.find((n) => n._id === namespaceId)?.name || "None";

  return (
    <div className={`item-row ${checked ? "selected" : ""}`}>
      <div className="col col-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </div>
      <div className="col col-key" title={translationKey}>
        {translationKey}
      </div>
      <div className="col col-namespace">
        <span className="namespace-badge">{currentNamespaceName}</span>
      </div>
      <div className="col">{values.ge}</div>
      <div className="col">{values.en}</div>
      <div className="col actions">
        <div className="row-actions">
          <button className="edit-btn" onClick={onEdit}>
            რედაქტირება
          </button>
          <button className="delete-btn" onClick={onDelete}>
            წაშლა
          </button>
        </div>
      </div>
    </div>
  );
}
