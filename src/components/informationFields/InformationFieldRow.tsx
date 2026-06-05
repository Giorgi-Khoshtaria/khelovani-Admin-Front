import {
  INFORMATION_FIELD_TYPE_LABELS,
  InformationFieldType,
  type InformationField,
} from "@/types/informationField.types";
import "./InformationFieldRow.scss";

interface Props {
  field: InformationField;
  onEdit: (field: InformationField) => void;
  onDelete: (field: InformationField) => void;
}

const formatValue = (field: InformationField): string => {
  if (field.type === InformationFieldType.Date) {
    const parsed = Date.parse(field.value);
    if (!Number.isNaN(parsed)) return new Date(parsed).toLocaleDateString();
  }
  return field.value;
};

export default function InformationFieldRow({
  field,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="if-row">
      <div className="if-row__key">
        <code>{field.key}</code>
      </div>
      <div className="if-row__type">
        <span className={`if-row__badge if-row__badge--${field.type}`}>
          {INFORMATION_FIELD_TYPE_LABELS[field.type]}
        </span>
      </div>
      <div className="if-row__value" title={field.value}>
        {field.type === InformationFieldType.Upload ? (
          <a
            className="if-row__file"
            href={field.value}
            target="_blank"
            rel="noreferrer"
          >
            <img src={field.value} alt={field.key} />
            <span>{field.value.split("/").pop()}</span>
          </a>
        ) : (
          formatValue(field)
        )}
      </div>
      <div className="if-row__desc" title={field.description || ""}>
        {field.description || "—"}
      </div>
      <div className="if-row__actions">
        <button
          className="if-row__edit"
          onClick={() => onEdit(field)}
          title="რედაქტირება"
        >
          ✎
        </button>
        <button
          className="if-row__delete"
          onClick={() => onDelete(field)}
          title="წაშლა"
        >
          ×
        </button>
      </div>
    </div>
  );
}
