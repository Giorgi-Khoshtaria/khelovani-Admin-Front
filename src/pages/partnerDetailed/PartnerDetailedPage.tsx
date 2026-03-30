import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPartnerByIdRequest,
  updatePartnerStatus,
  updatePartnerRequest,
  deletePartnerRequest,
  uploadPartnerPhotoRequest,
} from "@/apiCalls/partnerApiCalls/getPartner.req";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";
import "./PartnerDetailedPage.scss";
import { usePartnerContext } from "@/context/PartnerContext";
import { useLogout } from "@/hooks/auth/useLogout";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import type { Partner } from "@/types/partner.types";
import { parseJwt } from "@/utils/parseJwt";
import { validatePartnerForm } from "@/validations/partnerValidations";
import { PartnerHeader } from "@/components/partners/detailed/PartnerHeader";
import { PartnerCompanyPanel } from "@/components/partners/detailed/PartnerCompanyPanel";
import { PartnerInfoGrid } from "@/components/partners/detailed/PartnerInfoGrid";

export default function PartnerDetailedPage() {
  const { id: urlId } = useParams<{ id: string }>();
  const { partnerId: contextId, token } = usePartnerContext();
  const id = urlId || contextId;
  const navigate = useNavigate();
  const logout = useLogout();

  const decoded = parseJwt(token || "");
  const userRole = decoded?.role;
  const isAdmin = userRole === "admin" || userRole === "super_admin";
  const isOwnProfile = contextId === id;

  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Partner>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ავტორიზაცია ვერ მოხერხდა (პარტნიორის ID არ მოიძებნა)");
      return;
    }

    const fetchPartner = async () => {
      try {
        setLoading(true);
        const data = await getPartnerByIdRequest(id);
        setPartner(data);
        setEditForm(data);
      } catch (err) {
        setError(getErrorMessage(err, "ინფორმაციის ჩატვირთვა ვერ მოხერხდა"));
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  const handleStatusUpdate = async (
    newStatus: typeof PartnerStatus.APPROVED | typeof PartnerStatus.REJECTED | typeof PartnerStatus.BANNED,
  ) => {
    if (!id || !partner) return;

    try {
      setUpdating(true);
      await updatePartnerStatus(id, newStatus);
      setPartner({ ...partner, status: newStatus });
      toast.success("სტატუსი წარმატებით განახლდა");
    } catch (err) {
      toast.error(getErrorMessage(err, "სტატუსის განახლება ვერ მოხერხდა"));
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setEditForm((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!id || !editForm) return;

    const errors = validatePartnerForm({
      companyNameGe: editForm.companyNameGe || "",
      companyNameEn: editForm.companyNameEn,
      phone: editForm.phone || "",
      email: editForm.email || "",
      address: editForm.address || "",
      addressEn: editForm.addressEn || "",
      website: editForm.website,
      facebook: editForm.facebook,
      instagram: editForm.instagram,
      tiktok: editForm.tiktok,
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("გთხოვთ შეავსოთ სავალდებულო ველები");
      return;
    }

    try {
      setUpdating(true);
      const updatedData = await updatePartnerRequest(id, editForm);
      setPartner(updatedData);
      setIsEditing(false);
      toast.success("ინფორმაცია წარმატებით განახლდა");
    } catch (err) {
      toast.error(getErrorMessage(err, "განახლება ვერ მოხერხდა"));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("ნამდვილად გსურთ პარტნიორის წაშლა?")) return;

    try {
      setUpdating(true);
      await deletePartnerRequest(id);
      toast.success("პარტნიორი წაიშალა");
      if (isOwnProfile) {
        logout();
      } else {
        navigate("/partners");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    } finally {
      setUpdating(false);
    }
  };

  const handlePhotoChange = async (file: File) => {
    if (!id) return;

    try {
      setUpdating(true);
      const updatedData = await uploadPartnerPhotoRequest(id, file);
      setPartner(updatedData);
      toast.success("პროფილის ფოტო განახლდა");
    } catch (err) {
      toast.error(getErrorMessage(err, "ფოტოს ატვირთვა ვერ მოხერხდა"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">იტვირთება...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!partner) return <div className="error">პარტნიორი ვერ მოიძებნა</div>;

  return (
    <div className="partner-profile">
      <PartnerHeader
        partner={partner}
        isAdmin={isAdmin}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        updating={updating}
        onBack={() => navigate("/partners")}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setEditForm(partner);
          setFormErrors({});
        }}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />

      <PartnerCompanyPanel
        partner={partner}
        isEditing={isEditing}
        editForm={editForm}
        onChange={handleChange}
        errors={formErrors}
        isOwnProfile={isOwnProfile}
        onPhotoChange={handlePhotoChange}
      />

      <PartnerInfoGrid
        partner={partner}
        isEditing={isEditing}
        isAdmin={isAdmin}
        editForm={editForm}
        onChange={handleChange}
        errors={formErrors}
      />
    </div>
  );
}
