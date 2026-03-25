import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import { toast } from "react-toastify";
import { useNavigateToLogin } from "@/hooks/useNavigateToLogin";
import {
  getMenuItemsRequest,
  createMenuItemRequest,
  updateMenuItemRequest,
  deleteMenuItemRequest,
  type MenuItem,
} from "@/apiCalls/menuApiCalls/menu.req";
import { validateMenuItemForm } from "@/validations/menuValidations";
import "./Menu.scss";

const EMPTY_FORM = {
  labelKa: "",
  labelEn: "",
  href: "",
  order: 0,
  isActive: true,
};

type FormState = typeof EMPTY_FORM;


function Menu() {
  useNavigateToLogin();
  const navigate = useNavigate();
  const { token, partnerId } = usePartnerContext();

  useEffect(() => {
    const decoded = parseJwt(token || "");
    const role = decoded?.role;
    if (role === "organisation" && partnerId) {
      navigate(`/partners/${partnerId}`, { replace: true });
    }
  }, [token, partnerId, navigate]);

  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMenuItemsRequest();
      setItems(data);
    } catch {
      toast.error("მენიუს ჩატვირთვა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      labelKa: item.label.ka,
      labelEn: item.label.en,
      href: item.href,
      order: item.order,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateMenuItemForm(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSaving(true);
    const payload = {
      label: { ka: form.labelKa.trim(), en: form.labelEn.trim() },
      href: form.href.trim(),
      order: Number(form.order),
      isActive: form.isActive,
    };

    try {
      if (editingItem) {
        await updateMenuItemRequest(editingItem._id, payload);
        toast.success("მენიუს ელემენტი განახლდა");
      } else {
        await createMenuItemRequest(payload);
        toast.success("მენიუს ელემენტი დაემატა");
      }
      closeModal();
      fetchItems();
    } catch {
      toast.error("შეცდომა. სცადეთ თავიდან.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    setDeletingId(id);
    try {
      await deleteMenuItemRequest(id);
      toast.success("წაიშალა");
      fetchItems();
    } catch {
      toast.error("წაშლა ვერ მოხერხდა");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="menu-page">
      <div className="page-header">
        <h1>ნავიგაციის მართვა</h1>
        <button className="btn-primary" onClick={openCreate}>
          + ელემენტის დამატება
        </button>
      </div>

      {isLoading ? (
        <div className="loading">იტვირთება...</div>
      ) : (
        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>#</th>
                <th>სახელი (KA)</th>
                <th>სახელი (EN)</th>
                <th>ლინკი (href)</th>
                <th>სტატუსი</th>
                <th>მოქმედება</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    მენიუ ცარიელია. დაამატეთ პირველი ელემენტი.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.order}</td>
                    <td>{item.label.ka}</td>
                    <td>{item.label.en}</td>
                    <td>
                      <code>{item.href}</code>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${item.isActive ? "approved" : "rejected"}`}
                      >
                        {item.isActive ? "აქტიური" : "გამორთული"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-primary-sm"
                        onClick={() => openEdit(item)}
                      >
                        რედაქტირება
                      </button>
                      <button
                        className="btn-danger-sm"
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                      >
                        {deletingId === item._id ? "..." : "წაშლა"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? "ელემენტის რედაქტირება" : "ელემენტის დამატება"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>სახელი (ქართული)</label>
                <input
                  name="labelKa"
                  value={form.labelKa}
                  onChange={handleChange}
                  placeholder="მთავარი"
                  className={errors.labelKa ? "input-error" : ""}
                />
                {errors.labelKa && <span className="error-text">{errors.labelKa}</span>}
              </div>
              <div className="form-group">
                <label>სახელი (ინგლისური)</label>
                <input
                  name="labelEn"
                  value={form.labelEn}
                  onChange={handleChange}
                  placeholder="Home"
                  className={errors.labelEn ? "input-error" : ""}
                />
                {errors.labelEn && <span className="error-text">{errors.labelEn}</span>}
              </div>
              <div className="form-group">
                <label>ლინკი (href)</label>
                <input
                  name="href"
                  value={form.href}
                  onChange={handleChange}
                  placeholder="/about"
                  className={errors.href ? "input-error" : ""}
                />
                {errors.href && <span className="error-text">{errors.href}</span>}
              </div>
              <div className="form-group">
                <label>რიგითობა (order)</label>
                <input
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  min={0}
                  className={errors.order ? "input-error" : ""}
                />
                {errors.order && <span className="error-text">{errors.order}</span>}
              </div>
              <div className="form-group form-group--checkbox">
                <label>
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  <span>აქტიური</span>
                </label>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={closeModal}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? "ინახება..." : "შენახვა"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
