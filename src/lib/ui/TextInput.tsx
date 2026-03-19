import "@/lib/styles/_inputs.scss";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  error?: string;
  maxLength?: number;
  fullWidth?: boolean;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  maxLength,
  fullWidth,
}: TextInputProps) {
  return (
    <div className={`form-group${fullWidth ? " form-group--full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
