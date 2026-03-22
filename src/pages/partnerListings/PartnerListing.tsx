import { useEffect, useState } from "react";
import PartnerCard, {
  type PartnerData,
} from "../../components/partners/PartnerCard/PartnerCard";
import "./partnerListing.scss";
import axios from "axios";
import { getAllPartnerRequest } from "@/apiCalls/partnerApiCalls/getPartner.req";

export default function PartnerListing() {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await getAllPartnerRequest(debouncedQuery, activeTab);
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
  }, [debouncedQuery, activeTab]);

  const filteredPartners = partners;

  return (
    <div className="partner-listing-page">
      <div className="page-header">
        <h1>პარტნიორების სია</h1>
        <div className="tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "active" : ""}
          >
            ყველა
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={activeTab === "pending" ? "active" : ""}
          >
            მოლოდინი
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={activeTab === "approved" ? "active" : ""}
          >
            დადასტურებული
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={activeTab === "rejected" ? "active" : ""}
          >
            უარყოფილი
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="ძებნა კომპანიის სახელით..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">იტვირთება მონაცემები...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredPartners.length === 0 ? (
        <div className="no-data">განყოფილება ცარიელია</div>
      ) : (
        <div className="partners-list">
          <div className="list-body">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner._id} partner={partner} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
