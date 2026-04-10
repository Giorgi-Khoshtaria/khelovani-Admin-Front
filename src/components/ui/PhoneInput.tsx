interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  fullWidth?: boolean;
}

export default function PhoneInput({
  id,
  label,
  value,
  onChange,
  error,
  fullWidth,
}: PhoneInputProps) {
  return (
    <div className={`form-group${fullWidth ? " form-group--full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className={`phone-input-wrapper${error ? " input-error" : ""}`}>
        <input
          type="tel"
          id={id}
          value={value}
          onChange={onChange}
          placeholder="+995 5XX XXX XXX"
        />
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
