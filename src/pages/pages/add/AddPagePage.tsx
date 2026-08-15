import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPageRequest } from "@/apiCalls/pageApiCalls/page.req";
import { createMenuItemRequest } from "@/apiCalls/menuApiCalls/menu.req";
import { validatePageForm } from "@/validations/pageValidations";
import { PageForm, type PageFormState } from "@/components/pages/PageForm";
import { getErrorMessage } from "@/utils/handleApiError";
import "./AddPagePage.scss";

const EMPTY_FORM: PageFormState = {
  path: "",
  titleKa: "",
  titleEn: "",
  descriptionKa: "",
  descriptionEn: "",
  ogImage: "",
  noindex: false,
  showInNav: false,
  navLabelKa: "",
  navLabelEn: "",
  navOrder: 0,
};

export default function AddPagePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PageFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? Number(value)
              : value,
      };
      // Prefill nav labels from the title the first time nav is enabled.
      if (name === "showInNav" && checked && !prev.navLabelKa && !prev.navLabelEn) {
        next.navLabelKa = prev.titleKa.slice(0, 20);
        next.navLabelEn = prev.titleEn.slice(0, 20);
      }
      return next;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageChange = (url: string) => {
    setForm((prev) => ({ ...prev, ogImage: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validatePageForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSaving(true);
    try {
      const path = form.path.trim();
      await createPageRequest({
        path,
        title: { ka: form.titleKa.trim(), en: form.titleEn.trim() },
        description: { ka: form.descriptionKa.trim(), en: form.descriptionEn.trim() },
        ogImage: form.ogImage,
        noindex: form.noindex,
      });

      if (form.showInNav) {
        await createMenuItemRequest({
          label: { ka: form.navLabelKa.trim(), en: form.navLabelEn.trim() },
          href: path,
          order: form.navOrder,
          isActive: true,
        });
      }

      toast.success("გვერდი დაემატა");
      navigate("/pages");
    } catch (err) {
      toast.error(getErrorMessage(err, "შეცდომა. სცადეთ თავიდან."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="add-page-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← უკან
        </button>
        <div className="header-text">
          <h1>გვერდის დამატება</h1>
          <p>შეავსეთ SEO ინფორმაცია ახალი გვერდისთვის</p>
        </div>
      </div>

      <PageForm
        form={form}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        errors={errors}
        isSaving={isSaving}
      />
    </div>
  );
}
