import type { NamespaceItem } from "@/types/translation.types";
import TextInput from "../ui/TextInput";
import TextareaInput from "../ui/TextareaInput";
import "./TranslationEditModal.scss";

interface TranslationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string) => void;
  data: {
    id: string | null;
    ge: string;
    en: string;
    key: string;
    namespace: string;
    errors: Record<string, string>;
  };
  setGe: (val: string) => void;
  setEn: (val: string) => void;
  setKey: (val: string) => void;
  setNamespace: (val: string) => void;
  namespaces: NamespaceItem[];
}

export default function TranslationEditModal({
  isOpen,
  onClose,
  onSave,
  data,
  setGe,
  setEn,
  setKey,
  setNamespace,
  namespaces,
}: TranslationEditModalProps) {
  if (!isOpen || !data.id) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>რედაქტირება</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <TextInput
              id="edit-key"
              label="გასაღები (Key)"
              value={data.key}
              onChange={(e) => setKey(e.target.value)}
              error={data.errors.key}
              fullWidth
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-namespace">ნეიმსპეისი (Namespace)</label>
              <select
                id="edit-namespace"
                value={data.namespace}
                onChange={(e) => setNamespace(e.target.value)}
              >
                {namespaces.map((ns) => (
                  <option key={ns._id} value={ns._id}>
                    {ns.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <TextareaInput
              id="edit-ge"
              label="ქართული (GE)"
              value={data.ge}
              onChange={(e) => setGe(e.target.value)}
              error={data.errors.ge}
              rows={4}
            />
          </div>

          <div className="form-row">
            <TextareaInput
              id="edit-en"
              label="ინგლისური (EN)"
              value={data.en}
              onChange={(e) => setEn(e.target.value)}
              error={data.errors.en}
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            გაუქმება
          </button>
          <button className="btn-save" onClick={() => onSave(data.id!)}>
            შენახვა
          </button>
        </div>
      </div>
    </div>
  );
}
