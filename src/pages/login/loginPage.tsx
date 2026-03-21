import "./loginPage.scss";
import "@/styles/defaultTexts.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import TextInput from "@/lib/ui/TextInput";
import PasswordInput from "@/lib/ui/PasswordInput";
import { useFormHandler } from "@/lib/hooks/useFormHandler";
import { loginRequest } from "@/apiCalls/authApiCalls/login.req";
import { usePartnerContext } from "@/context/PartnerContext";

interface AdminLoginForm {
  email: string;
  password: string;
}

const INITIAL_FORM: AdminLoginForm = {
  email: "",
  password: "",
};

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { setToken, setPartnerId } = usePartnerContext();

  const { formData, errors, handleChange } = useFormHandler(INITIAL_FORM);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await loginRequest(formData.email, formData.password);
      console.log("Login Response Data:", response);

      const token =
        response.token ||
        response.accessToken ||
        response.jwt ||
        response.data?.token;
      if (!token) {
        console.error("Warning: No token found in response object!");
      }

      const partnerId =
        response._id || response.id || response.partnerId || response.user?._id;

      setToken(token);
      setPartnerId(partnerId);

      toast.success("წარმატებით შეხვედით ადმინ პანელში!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const responseData = error?.response?.data;
        if (responseData?.errors) {
          Object.values(responseData.errors).forEach((errMsg) => {
            if (typeof errMsg === "string") toast.error(errMsg);
          });
        } else if (responseData?.message) {
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
