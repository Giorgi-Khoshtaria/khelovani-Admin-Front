interface TextareaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  rows?: number;
  fullWidth?: boolean;
}

export default function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  rows = 3,
  fullWidth,
}: TextareaInputProps) {
  return (
    <div className={`form-group${fullWidth ? " form-group--full" : ""}`}>
      <label htmlFor={id}>
        {label}
        {hint && <span className="label-hint">{hint}</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
        placeholder={placeholder}
        rows={rows}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
