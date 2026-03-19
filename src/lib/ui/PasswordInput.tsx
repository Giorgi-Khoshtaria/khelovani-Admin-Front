"use client";
import "@/lib/styles/_inputs.scss";

import { useState } from "react";
import { EyeOpen, EyeOff } from "./EyeIcons";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  fullWidth,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={`form-group${fullWidth ? " form-group--full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className={`input-password${error ? " input-error" : ""}`}>
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShow((p) => !p)}
          aria-label="პაროლის ჩვენება"
        >
          {show ? <EyeOff /> : <EyeOpen />}
        </button>
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
