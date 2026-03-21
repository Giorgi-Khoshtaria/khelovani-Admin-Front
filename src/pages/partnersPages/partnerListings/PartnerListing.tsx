import { useEffect, useState } from "react";
import PartnerCard, {
  type PartnerData,
} from "../../../components/partnerComponents/PartnerCard";
import "./partnerListing.scss";
import axios from "axios";
import { getAllPartnerRequest } from "@/apiCalls/partnerApiCalls/getAllPartner.req";

export default function PartnerListing() {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await getAllPartnerRequest();
        setPartners(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "პარტნიორების ჩატვირთვა ვერ მოხერხდა",
          );
        } else {
          setError("მოხდა გაუთვალისწინებელი შეცდომა");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="partner-listing-page">
      <div className="page-header">
        <h1>პარტნიორების სია</h1>
      </div>

      {loading ? (
        <div className="loading">იტვირთება მონაცემები...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : partners.length === 0 ? (
        <div className="no-data">რეგისტრირებული პარტნიორები არ მოიძებნა</div>
      ) : (
        <div className="partners-grid">
          {partners.map((partner) => (
            <PartnerCard key={partner._id} partner={partner} />
          ))}
        </div>
      )}
    </div>
  );
}
