import { Link } from "react-router-dom";

interface TermsCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  termsTo?: string;
  privacyTo?: string;
}

export default function TermsCheckbox({
  id,
  checked,
  onChange,
  error,
  termsTo = "/terms",
  privacyTo = "/privacy",
}: TermsCheckboxProps) {
  return (
    <div className="terms-container form-group--full">
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>
          ვეთანხმები <Link to={termsTo}>მომსახურების პირობებს</Link> და{" "}
          <Link to={privacyTo}>კონფიდენციალურობის პოლიტიკას</Link>
        </label>
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
