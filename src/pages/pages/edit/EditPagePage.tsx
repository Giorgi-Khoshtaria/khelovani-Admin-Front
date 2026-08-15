import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getPagesRequest,
  updatePageRequest,
  type Page,
} from "@/apiCalls/pageApiCalls/page.req";
import {
  getMenuItemsRequest,
  createMenuItemRequest,
  updateMenuItemRequest,
  deleteMenuItemRequest,
  type MenuItem,
} from "@/apiCalls/menuApiCalls/menu.req";
import { validatePageForm } from "@/validations/pageValidations";
import { PageForm, type PageFormState } from "@/components/pages/PageForm";
import { getErrorMessage } from "@/utils/handleApiError";
import "../add/AddPagePage.scss";

const toFormState = (item: Page, navItem: MenuItem | null): PageFormState => ({
  path: item.path,
  titleKa: item.title.ka,
  titleEn: item.title.en,
  descriptionKa: item.description.ka,
  descriptionEn: item.description.en,
  ogImage: item.ogImage,
  noindex: item.noindex,
  showInNav: !!navItem,
  navLabelKa: navItem?.label.ka ?? "",
  navLabelEn: navItem?.label.en ?? "",
  navOrder: navItem?.order ?? 0,
});

export default function EditPagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const stateItem = (location.state as { item?: Page } | null)?.item;

  const [form, setForm] = useState<PageFormState | null>(null);
  const [matchedMenuItemId, setMatchedMenuItemId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setFetching(true);
        const [pageItem, menuItems] = await Promise.all([
          stateItem ? Promise.resolve(stateItem) : getPagesRequest().then(
            (items) => items.find((item) => item._id === id) ?? null,
          ),
          getMenuItemsRequest().catch((): MenuItem[] => []),
        ]);

        if (!pageItem) {
          toast.error("გვერდი ვერ მოიძებნა");
          navigate("/pages");
          return;
        }

        const navItem = menuItems.find((m) => m.href === pageItem.path) ?? null;
        setMatchedMenuItemId(navItem?._id ?? null);
        setForm(toFormState(pageItem, navItem));
      } catch (err) {
        toast.error(getErrorMessage(err, "გვერდის ჩატვირთვა ვერ მოხერხდა"));
        navigate("/pages");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [id, stateItem, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? Number(value)
              : value,
      };
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
    setForm((prev) => (prev ? { ...prev, ogImage: url } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    const formErrors = validatePageForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSaving(true);
    try {
      const path = form.path.trim();
      await updatePageRequest(id, {
        path,
        title: { ka: form.titleKa.trim(), en: form.titleEn.trim() },
        description: { ka: form.descriptionKa.trim(), en: form.descriptionEn.trim() },
        ogImage: form.ogImage,
        noindex: form.noindex,
      });

      if (form.showInNav) {
        const navPayload = {
          label: { ka: form.navLabelKa.trim(), en: form.navLabelEn.trim() },
          href: path,
          order: form.navOrder,
          isActive: true,
        };
        if (matchedMenuItemId) {
          await updateMenuItemRequest(matchedMenuItemId, navPayload);
        } else {
          await createMenuItemRequest(navPayload);
        }
      } else if (matchedMenuItemId) {
        await deleteMenuItemRequest(matchedMenuItemId);
      }

      toast.success("გვერდი განახლდა");
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
          <h1>გვერდის რედაქტირება</h1>
          <p>განაახლეთ SEO ინფორმაცია</p>
        </div>
      </div>

      {fetching || !form ? (
        <div className="loading">იტვირთება...</div>
      ) : (
        <PageForm
          form={form}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          errors={errors}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
