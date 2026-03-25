import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPartnerByIdRequest,
  updatePartnerStatus,
  updatePartnerRequest,
  deletePartnerRequest,
} from "@/apiCalls/partnerApiCalls/getPartner.req";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";
import "./PartnerDetailedPage.scss";
import TextInput from "@/lib/ui/TextInput";
import TextareaInput from "@/lib/ui/TextareaInput";
import { usePartnerContext } from "@/context/PartnerContext";
import { useLogout } from "@/hooks/useLogout";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import type { Partner } from "@/types/partner.types";
import { parseJwt } from "@/utils/parseJwt";
import { validatePartnerForm } from "@/validations/partnerValidations";

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
    newStatus: typeof PartnerStatus.APPROVED | typeof PartnerStatus.REJECTED,
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

  if (loading) return <div className="loading">იტვირთება...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!partner) return <div className="error">პარტნიორი ვერ მოიძებნა</div>;

  return (
    <div className="partner-profile">
      <div className="profile-header">
        <div className="header-title">
          {isAdmin && (
            <button className="back-btn" onClick={() => navigate("/partners")}>
              ← უკან
            </button>
          )}
          <h1>
            {partner.companyNameGe}
            <span className="eng-name">({partner.companyNameEn})</span>
          </h1>
        </div>

        <div className="header-actions">
          {/* OWN PROFILE ACTIONS: Edit, Delete, Save, Cancel */}
          {isOwnProfile && (
            <>
              {isEditing ? (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave} disabled={updating}>
                    {updating ? "ინახება..." : "შენახვა"}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(partner);
                      setFormErrors({});
                    }}
                    disabled={updating}
                  >
                    გაუქმება
                  </button>
                </div>
              ) : (
                <div className="profile-owner-actions">
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    რედაქტირება
                  </button>
                  <button className="delete-btn" onClick={handleDelete} disabled={updating}>
                    წაშლა
                  </button>
                </div>
              )}
            </>
          )}

          {/* ADMIN ACTIONS: Approve, Reject */}
          {!isEditing && isAdmin && (
            <div className="admin-status-actions">
              {partner.status === PartnerStatus.PENDING && (
                <button
                  className="approve-btn"
                  onClick={() => handleStatusUpdate(PartnerStatus.APPROVED)}
                  disabled={updating}
                >
                  {updating ? "..." : "დადასტურება"}
                </button>
              )}
              {(partner.status === PartnerStatus.PENDING ||
                partner.status === PartnerStatus.APPROVED) && (
                <button
                  className="reject-btn"
                  onClick={() => handleStatusUpdate(PartnerStatus.REJECTED)}
                  disabled={updating}
                >
                  {updating ? "..." : "უარყოფა"}
                </button>
              )}
            </div>
          )}

          {!isEditing && (
            <div className={`status-badge ${partner.status}`}>
              {partner.status === PartnerStatus.PENDING
                ? "მოლოდინი"
                : partner.status === PartnerStatus.APPROVED
                  ? "დადასტურებული"
                  : "უარყოფილი"}
            </div>
          )}
        </div>
      </div>

      <div className="company-info-panel">
        <div className="company-logo">
          {partner.companyNameGe.charAt(0).toUpperCase()}
        </div>
        <div className="company-text">
          {isEditing ? (
            <div className="edit-company-names">
              <TextInput
                id="companyNameGe"
                label="კომპანიის სახელი (GE)"
                value={editForm.companyNameGe || ""}
                onChange={handleChange}
                error={formErrors.companyNameGe}
                fullWidth
              />
              <TextInput
                id="companyNameEn"
                label="კომპანიის სახელი (EN)"
                value={editForm.companyNameEn || ""}
                onChange={handleChange}
                fullWidth
              />
            </div>
          ) : (
            <>
              <h2 className="company-title-ge">{partner.companyNameGe}</h2>
              <p className="company-title-en">({partner.companyNameEn})</p>
            </>
          )}
        </div>
      </div>

      <div className="profile-grid">
        <div className="info-section">
          <h2>ზოგადი ინფორმაცია</h2>
          <TextInput
            id="identificationCode"
            label="საიდენტიფიკაციო კოდი"
            value={isEditing ? editForm.identificationCode || "" : partner.identificationCode}
            onChange={handleChange}
            readOnly={!isAdmin}
            fullWidth
          />
          <TextInput
            id="contactPerson"
            label="საკონტაქტო პირი"
            value={isEditing ? editForm.contactPerson || "" : partner.contactPerson}
            onChange={handleChange}
            readOnly={!isEditing}
            fullWidth
          />
          <TextInput
            id="city"
            label="ქალაქი"
            value={isEditing ? editForm.city || "" : partner.city}
            onChange={handleChange}
            readOnly={!isEditing}
            fullWidth
          />
          <TextInput
            id="address"
            label="მისამართი"
            value={isEditing ? editForm.address || "" : partner.address}
            onChange={handleChange}
            readOnly={!isEditing}
            error={formErrors.address}
            fullWidth
          />
          <TextInput
            id="addressEn"
            label="მისამართი (ინგლისურად)"
            value={isEditing ? editForm.addressEn || "" : partner.addressEn}
            onChange={handleChange}
            readOnly={!isEditing}
            error={formErrors.addressEn}
            fullWidth
          />
        </div>

        <div className="info-section">
          <h2>საკონტაქტო ინფორმაცია</h2>
          <TextInput
            id="phone"
            label="ტელეფონი"
            value={isEditing ? editForm.phone || "" : partner.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            error={formErrors.phone}
            fullWidth
          />
          <TextInput
            id="email"
            label="ელ. ფოსტა"
            value={isEditing ? editForm.email || "" : partner.email}
            onChange={handleChange}
            readOnly={!isEditing}
            error={formErrors.email}
            fullWidth
          />
        </div>

        <div className="info-section social-links">
          <h2>სოციალური ბმულები</h2>
          <TextInput
            id="website"
            label="ვებ-საიტი"
            value={isEditing ? editForm.website || "" : partner.website || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            placeholder="https://example.com"
            fullWidth
          />
          <TextInput
            id="facebook"
            label="Facebook"
            value={isEditing ? editForm.facebook || "" : partner.facebook || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            placeholder="Facebook URL"
            fullWidth
          />
          <TextInput
            id="instagram"
            label="Instagram"
            value={isEditing ? editForm.instagram || "" : partner.instagram || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            placeholder="Instagram URL"
            fullWidth
          />
          <TextInput
            id="tiktok"
            label="TikTok"
            value={isEditing ? editForm.tiktok || "" : partner.tiktok || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            placeholder="TikTok URL"
            fullWidth
          />
        </div>
      </div>

      {(partner.description || isEditing) && (
        <div className="info-section description">
          <h2>აღწერა</h2>
          <TextareaInput
            id="description"
            label="აღწერა"
            value={(isEditing ? editForm.description : partner.description) || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            fullWidth
            rows={5}
          />
        </div>
      )}
    </div>
  );
}
