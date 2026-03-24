import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartnerByIdRequest, updatePartnerStatus } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";
import "./PartnerDetailedPage.scss";
import TextInput from "@/lib/ui/TextInput";
import TextareaInput from "@/lib/ui/TextareaInput";
import { usePartnerContext } from "@/context/PartnerContext";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import type { Partner } from "@/types/partner.types";

export default function PartnerDetailedPage() {
  const { id: urlId } = useParams<{ id: string }>();
  const { partnerId: contextId } = usePartnerContext();
  const id = urlId || contextId;
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

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
      } catch (err) {
        toast.error(getErrorMessage(err, "სტატუსის განახლება ვერ მოხერხდა"));
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
          <button className="back-btn" onClick={() => navigate("/partners")}>
            ← უკან
          </button>
        </div>
        <div className="header-actions">
          {partner.status === PartnerStatus.APPROVED && (
            <button
              className="reject-btn"
              onClick={() => handleStatusUpdate(PartnerStatus.REJECTED)}
              disabled={updating}
            >
              {updating ? "მუშავდება..." : "უარყოფა"}
            </button>
          )}
          <div className={`status-badge ${partner.status}`}>
            {partner.status === PartnerStatus.PENDING
              ? "მოლოდინი"
              : partner.status === PartnerStatus.APPROVED
                ? "დადასტურებული"
                : "უარყოფილი"}
          </div>
        </div>
      </div>

      {partner.status === PartnerStatus.PENDING && (
        <div className="actions-section">
          <h3>პარტნიორის მართვა</h3>
          <div className="action-buttons">
            <button
              className="approve-btn"
              onClick={() => handleStatusUpdate(PartnerStatus.APPROVED)}
              disabled={updating}
            >
              {updating ? "მუშავდება..." : "დადასტურება"}
            </button>
            <button
              className="reject-btn"
              onClick={() => handleStatusUpdate(PartnerStatus.REJECTED)}
              disabled={updating}
            >
              {updating ? "მუშავდება..." : "უარყოფა"}
            </button>
          </div>
        </div>
      )}

      <div className="company-info-panel">
        <div className="company-logo">
          {partner.companyNameGe.charAt(0).toUpperCase()}
        </div>
        <div className="company-text">
          <h2 className="company-title-ge">{partner.companyNameGe}</h2>
          <p className="company-title-en">({partner.companyNameEn})</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="info-section">
          <h2>ზოგადი ინფორმაცია</h2>
          <TextInput
            id="identificationCode"
            label="საიდენტიფიკაციო კოდი"
            value={partner.identificationCode}
            readOnly
            fullWidth
          />
          <TextInput
            id="contactPerson"
            label="საკონტაქტო პირი"
            value={partner.contactPerson}
            readOnly
            fullWidth
          />
          <TextInput
            id="city"
            label="ქალაქი"
            value={partner.city}
            readOnly
            fullWidth
          />
          <TextInput
            id="address"
            label="მისამართი"
            value={partner.address}
            readOnly
            fullWidth
          />
          <TextInput
            id="addressEn"
            label="მისამართი (ინგლისურად)"
            value={partner.addressEn}
            readOnly
            fullWidth
          />
        </div>

        <div className="info-section">
          <h2>საკონტაქტო ინფორმაცია</h2>
          <TextInput
            id="phone"
            label="ტელეფონი"
            value={partner.phone}
            readOnly
            fullWidth
          />
          <TextInput
            id="email"
            label="ელ. ფოსტა"
            value={partner.email}
            readOnly
            fullWidth
          />
        </div>
      </div>

      {partner.description && (
        <div className="info-section description">
          <h2>აღწერა</h2>
          <TextareaInput
            id="description"
            label="აღწერა"
            value={partner.description}
            readOnly
            fullWidth
            rows={5}
          />
        </div>
      )}
    </div>
  );
}
