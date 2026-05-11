import React from "react";
import "./FormActions.scss";

interface FormActionsProps {
  loading: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ loading, isEdit, onCancel }) => (
  <div className="pf-actions">
    {onCancel && (
      <button
        type="button"
        className="pf-btn pf-btn--cancel"
        onClick={onCancel}
        disabled={loading}
      >
        გაუქმება
      </button>
    )}
    <button type="submit" className="pf-btn pf-btn--submit" disabled={loading}>
      {loading ? (
        <>
          <span className="pf-spinner" />
          იშვება...
        </>
      ) : isEdit ? (
        "განახლება"
      ) : (
        "პროდუქტის დამატება"
      )}
    </button>
  </div>
);

export default FormActions;
