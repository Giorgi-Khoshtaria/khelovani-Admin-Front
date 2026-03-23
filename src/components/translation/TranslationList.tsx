import type { RawTranslation } from "@/types/translation.types";
import TranslationItem from "./TranslationItem";

interface TranslationListProps {
  filteredKeys: string[];
  translations: Record<string, { ge: string; en: string }>;
  rawTranslations: RawTranslation[];
  activeNamespace: string;
  editingId: string | null;
  editGe: string;
  setEditGe: (value: string) => void;
  editEn: string;
  setEditEn: (value: string) => void;
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
  filteredKeys,
  translations,
  rawTranslations,
  activeNamespace,
  editingId,
  editGe,
  setEditGe,
  editEn,
  setEditEn,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  selectedIds,
  onSelectChange,
  onSelectAll,
}: TranslationListProps) {
  const allFilteredIds = filteredKeys
    .map((k) => {
      const found = rawTranslations.find(
        (r) => r.namespace === activeNamespace && r.key === k,
      );
      return found?._id || "";
    })
    .filter(Boolean);

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
        {filteredKeys.map((key) => {
          const values = translations[key];

          if (!values) return null;

          const foundRaw = rawTranslations.find(
            (r: RawTranslation) =>
              r.namespace === activeNamespace && r.key === key,
          );
          const itemId = foundRaw?._id || "";
          const isEditing = editingId === itemId;
          const isChecked = selectedIds.includes(itemId);

          return (
            <TranslationItem
              key={key}
              translationKey={key}
              values={values}
              isEditing={isEditing}
              editGe={editGe}
              setEditGe={setEditGe}
              editEn={editEn}
              setEditEn={setEditEn}
              onEdit={() => onEdit({ _id: itemId, translations: values })}
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
