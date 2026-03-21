import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPartnerByIdRequest } from "@/apiCalls/partnerApiCalls/getPartner.req";
import { updatePartnerStatusRequest } from "@/apiCalls/partnerApiCalls/updatePartnerStatus.req";
import axios from "axios";
import "./PartnerProfilePage.scss";
import TextInput from "@/lib/ui/TextInput";
import TextareaInput from "@/lib/ui/TextareaInput";
import { usePartnerContext } from "@/context/PartnerContext";

interface Partner {
  _id: string;
  companyNameGe: string;
  companyNameEn: string;
  identificationCode: string;
  contactPerson: string;
  phone: string;
  city: string;
  email: string;
  address: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function PartnerProfilePage() {
  const { partnerId: id } = usePartnerContext();
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
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "ინფორმაციის ჩატვირთვა ვერ მოხერხდა",
          );
        } else {
          setError("მოხდა გაუთვალისწინებელი შეცდომა");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    if (!id || !partner) return;

    try {
      setUpdating(true);
      await updatePartnerStatusRequest(id, newStatus);
      setPartner({ ...partner, status: newStatus });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "სტატუსის განახლება ვერ მოხერხდა");
      } else {
        alert("მოხდა გაუთვალისწინებელი შეცდომა");
      }
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
          <button className="back-btn" onClick={() => navigate("/")}>
            ← უკან
          </button>
          <h1>
            {partner.companyNameGe}{" "}
            <span className="eng-name">({partner.companyNameEn})</span>
          </h1>
        </div>
        <div className={`status-badge ${partner.status}`}>
          {partner.status === "pending"
            ? "მოლოდინი"
            : partner.status === "approved"
              ? "დადასტურებული"
              : "უარყოფილი"}
        </div>
      </div>

      {partner.status === "pending" && (
        <div className="actions-section">
          <h3>პარტნიორის მართვა</h3>
          <div className="action-buttons">
            <button
              className="approve-btn"
              onClick={() => handleStatusUpdate("approved")}
              disabled={updating}
            >
              {updating ? "მუშავდება..." : "დადასტურება"}
            </button>
            <button
              className="reject-btn"
              onClick={() => handleStatusUpdate("rejected")}
              disabled={updating}
            >
              {updating ? "მუშავდება..." : "უარყოფა"}
            </button>
          </div>
        </div>
      )}

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
