import type { InformationField } from "@/types/informationField.types";
import ModalShell from "./ModalShell";
import "./ConfirmDeleteModal.scss";

interface Props {
  field: InformationField;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  field,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <ModalShell title="ველის წაშლა" onClose={onCancel} variant="confirm">
      <div className="if-confirm">
        <p>
          დარწმუნებული ხარ რომ გსურს <code>{field.key}</code>-ის წაშლა?
        </p>
        <div className="if-confirm__actions">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={onCancel}
          >
            გაუქმება
          </button>
          <button className="modal-btn modal-btn--danger" onClick={onConfirm}>
            წაშლა
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
