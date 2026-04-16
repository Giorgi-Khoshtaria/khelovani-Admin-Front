import type { RawTranslation } from "@/types/translation.types";
import TranslationItem from "./TranslationItem";
import "./TranslationList.scss";

interface TranslationListProps {
  items: RawTranslation[];
  onEdit: (item: RawTranslation) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelectChange: (id: string, checked: boolean) => void;
  onSelectAll: (ids: string[], checked: boolean) => void;
  namespaces: Array<{ _id: string; name: string }>;
}

export default function TranslationList({
  items,
  onEdit,
  onDelete,
  selectedIds,
  onSelectChange,
  onSelectAll,
  namespaces,
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
        <div className="col">Namespace</div>
        <div className="col">ქართული (GE)</div>
        <div className="col">ინგლისური (EN)</div>
        <div className="col actions">მოქმედება</div>
      </div>
      <div className="list-body">
        {items.map((item) => {
          const itemId = item._id;
          const isChecked = selectedIds.includes(itemId);

          return (
            <TranslationItem
              key={itemId}
              translationKey={item.key}
              values={item.translations}
              namespaceId={item.namespace}
              namespaces={namespaces}
              onEdit={() => onEdit(item)}
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
