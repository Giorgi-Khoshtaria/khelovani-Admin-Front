import {
  INFORMATION_FIELD_TYPES,
  INFORMATION_FIELD_TYPE_LABELS,
  InformationFieldType,
} from "@/types/informationField.types";
import "./InformationFieldsFilters.scss";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: InformationFieldType | "all";
  onTypeChange: (value: InformationFieldType | "all") => void;
}

export default function InformationFieldsFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
}: Props) {
  return (
    <div className="if-filters">
      <input
        type="text"
        className="if-filters__search"
        placeholder="ძებნა გასაღების, მნიშვნელობის ან აღწერის მიხედვით..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="if-filters__type"
        value={typeFilter}
        onChange={(e) =>
          onTypeChange(e.target.value as InformationFieldType | "all")
        }
      >
        <option value="all">ყველა ტიპი</option>
        {INFORMATION_FIELD_TYPES.map((t) => (
          <option key={t} value={t}>
            {INFORMATION_FIELD_TYPE_LABELS[t]}
          </option>
        ))}
      </select>
    </div>
  );
}
