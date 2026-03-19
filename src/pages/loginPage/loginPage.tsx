import "./loginPage.scss";
import "@/lib/styles/defaultTexts.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import TextInput from "@/lib/ui/TextInput";
import PasswordInput from "@/lib/ui/PasswordInput";
import { useFormHandler } from "@/lib/hooks/useFormHandler";
import { validateLoginForm } from "@/lib/validations/authValidations/loginValidations";
import { loginRequest } from "@/apiCalls/authApiCalls/login.req";

interface AdminLoginForm {
  email: string;
  password: string;
}

const INITIAL_FORM: AdminLoginForm = {
  email: "",
  password: "",
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { formData, errors, setErrors, handleChange } =
    useFormHandler(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateLoginForm(formData.email, formData.password);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await loginRequest(formData.email, formData.password);
      toast.success("წარმატებით შეხვედით ადმინ პანელში!");
      setTimeout(() => navigate("/menu"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData = error?.response?.data;
        if (responseData?.message) {
          toast.error(responseData.message);
        } else {
          toast.error("შესვლის დროს დაფიქსირდა შეცდომა");
        }
      } else {
        toast.error("შესვლის დროს დაფიქსირდა შეცდომა");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-page__form">
        <div className="admin-login-content">
          <div className="admin-login-content__icon">
            <img src="/assets/logo.png" width={100} height={50} alt="logo" />
          </div>
          <h2 className="large-text">ადმინ პანელი</h2>
        </div>

        <form
          className="admin-login-form__inputs"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextInput
            id="email"
            label="ელ-ფოსტა"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="admin@example.com"
            fullWidth
          />

          <PasswordInput
            id="password"
            label="პაროლი"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="შეიყვანე პაროლი"
          />

          <div className="admin-login-button">
            <button
              type="submit"
              disabled={isLoading}
              className="admin-login-btn"
            >
              {isLoading ? "მიმდინარეობს..." : "შესვლა"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
