import type { NamespaceItem } from "@/types/translation.types";
import "./TranslationForm.scss";

interface TranslationFormProps {
  form: {
    onSubmit: (e: React.FormEvent) => void;
    newKey: string;
    setNewKey: (value: string) => void;
    newGe: string;
    setNewGe: (value: string) => void;
    newEn: string;
    setNewEn: (value: string) => void;
    selectedNamespaceForAdd: string;
    setSelectedNamespaceForAdd: (value: string) => void;
    formErrors: Record<string, string>;
  };
  namespaces: NamespaceItem[];
}

export default function TranslationForm({
  form,
  namespaces,
}: TranslationFormProps) {
  const {
    onSubmit,
    newKey,
    setNewKey,
    newGe,
    setNewGe,
    newEn,
    setNewEn,
    selectedNamespaceForAdd: selectedNamespace,
    setSelectedNamespaceForAdd: setSelectedNamespace,
    formErrors,
  } = form;
  return (
    <form className="add-form" onSubmit={onSubmit}>
      <h3>ახალი თარგმანის დამატება</h3>
      <div className="form-group">
        <label>ნეიმსპეისი (Namespace):</label>
        <select
          value={selectedNamespace}
          onChange={(e) => setSelectedNamespace(e.target.value)}
        >
          {namespaces.map((ns) => (
            <option key={ns._id} value={ns._id}>
              {ns.name} ({ns._id})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>გასაღები (Key):</label>
        <input
          type="text"
          placeholder="მაგ: save_button"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        {formErrors.key && <span className="error-text">{formErrors.key}</span>}
      </div>
      <div className="form-group">
        <label>ქართული (GE):</label>
        <input
          type="text"
          placeholder="შენახვა"
          value={newGe}
          onChange={(e) => setNewGe(e.target.value)}
        />
        {formErrors.ge && <span className="error-text">{formErrors.ge}</span>}
      </div>
      <div className="form-group">
        <label>ინგლისური (EN):</label>
        <input
          type="text"
          placeholder="Save"
          value={newEn}
          onChange={(e) => setNewEn(e.target.value)}
        />
        {formErrors.en && <span className="error-text">{formErrors.en}</span>}
      </div>
      <button type="submit" className="submit-btn">
        დამატება
      </button>
    </form>
  );
}
