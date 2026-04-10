import type { RawTranslation } from "@/types/translation.types";
import TranslationItem from "./TranslationItem";
import "./TranslationList.scss";

interface TranslationListProps {
  items: RawTranslation[];
  editingId: string | null;
  editGe: string;
  setEditGe: (value: string) => void;
  editEn: string;
  setEditEn: (value: string) => void;
  editErrors: Record<string, string>;
  onEdit: (item: {
    _id: string;
    translations: { ge: string; en: string };
  }) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelectChange: (id: string, checked: boolean) => void;
  onSelectAll: (ids: string[], checked: boolean) => void;
}

export default function TranslationList({
  items,
  editingId,
  editGe,
  setEditGe,
  editEn,
  setEditEn,
  editErrors,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  selectedIds,
  onSelectChange,
  onSelectAll,
}: TranslationListProps) {
  const allFilteredIds = items.map((r) => r._id);

  const isAllSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedIds.includes(id));

  return (
    <div className="translations-list">
      <div className="list-header">
        <div className="col col-checkbox">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(allFilteredIds, e.target.checked)}
          />
        </div>
        <div className="col">გასაღები (Key)</div>
        <div className="col">ქართული (GE)</div>
        <div className="col">ინგლისური (EN)</div>
        <div className="col actions">მოქმედება</div>
      </div>
      <div className="list-body">
        {items.map((item) => {
          const itemId = item._id;
          const isEditing = editingId === itemId;
          const isChecked = selectedIds.includes(itemId);

          return (
            <TranslationItem
              key={itemId}
              translationKey={item.key}
              values={item.translations}
              isEditing={isEditing}
              editGe={editGe}
              setEditGe={setEditGe}
              editEn={editEn}
              setEditEn={setEditEn}
              editErrors={editErrors}
              onEdit={() => onEdit({ _id: itemId, translations: item.translations })}
              onSave={() => onSave(itemId)}
              onCancel={onCancel}
              onDelete={() => onDelete(itemId)}
              checked={isChecked}
              onSelect={(checked) => onSelectChange(itemId, checked)}
            />
          );
        })}
      </div>
    </div>
  );
}
