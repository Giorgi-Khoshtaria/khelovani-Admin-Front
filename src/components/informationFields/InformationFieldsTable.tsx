import type { InformationField } from "@/types/informationField.types";
import InformationFieldRow from "./InformationFieldRow";
import "./InformationFieldsTable.scss";

interface Props {
  fields: InformationField[];
  onEdit: (field: InformationField) => void;
  onDelete: (field: InformationField) => void;
}

export default function InformationFieldsTable({
  fields,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="if-table">
      <div className="if-table__header">
        <div>გასაღები</div>
        <div>ტიპი</div>
        <div>მნიშვნელობა</div>
        <div>აღწერა</div>
        <div></div>
      </div>

      {fields.map((field) => (
        <InformationFieldRow
          key={field._id}
          field={field}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
