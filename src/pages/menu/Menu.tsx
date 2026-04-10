import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getMenuItemsRequest,
  createMenuItemRequest,
  updateMenuItemRequest,
  deleteMenuItemRequest,
  type MenuItem,
} from "@/apiCalls/menuApiCalls/menu.req";
import { validateMenuItemForm } from "@/validations/menuValidations";
import { MenuTable } from "@/components/menu/MenuTable";
import { MenuModal } from "@/components/menu/MenuModal";
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

      <MenuTable
        items={items}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <MenuModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        form={form}
        onChange={handleChange}
        errors={errors}
        isSaving={isSaving}
      />
    </div>
  );
}

export default Menu;
