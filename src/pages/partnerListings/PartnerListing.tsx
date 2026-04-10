import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PartnerCard from "../../components/partners/PartnerCard/PartnerCard";
import type { PartnerData } from "@/types/partner.types";
import { PartnerStatus } from "@/lib/status/partnerStatus";
import "./partnerListing.scss";

import {
  getAllPartnerRequest,
  bulkDeletePartnersRequest,
} from "@/apiCalls/partnerApiCalls/getPartner.req";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/utils/handleApiError";
import { toast } from "react-toastify";

export default function PartnerListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync initial state with URL params
  const initialTab =
    (searchParams.get("status") as "all" | PartnerStatus) || "all";
  const initialSearch = searchParams.get("search") || "";

  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | PartnerStatus>(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedQuery = useDebounce(searchQuery, 500); // Reduced from 1000ms
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  // Sync tabs with URL
  const handleTabChange = (tab: "all" | PartnerStatus) => {
    setActiveTab(tab);
    setSearchParams((prev) => {
      if (tab === "all") {
        prev.delete("status");
      } else {
        prev.set("status", tab);
      }
      return prev;
    });
  };

  // Sync search with URL
  useEffect(() => {
    setSearchParams((prev) => {
      if (debouncedQuery) {
        prev.set("search", debouncedQuery);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  }, [debouncedQuery, setSearchParams]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const data = await getAllPartnerRequest(
          debouncedQuery,
          activeTab,
          currentPage,
          limit,
        );
        setPartners(data.partners || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(getErrorMessage(err, "პარტნიორების ჩატვირთვა ვერ მოხერხდა"));
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [debouncedQuery, activeTab, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, activeTab]);

  const refreshPartners = async () => {
    try {
      const data = await getAllPartnerRequest(
        debouncedQuery,
        activeTab,
        currentPage,
        limit,
      );
      setPartners(data.partners || []);
      setTotalPages(data.totalPages || 1);
      setSelectedIds([]); // Clear selection on refresh
    } catch (err) {
      console.error("Failed to refresh:", err);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((i) => i !== id),
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? partners.map((p) => p._id) : []);
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `ნამდვილად გსურთ ${selectedIds.length} პარტნიორის წაშლა?`,
      )
    )
      return;

    try {
      setIsDeleting(true);
      await bulkDeletePartnersRequest(selectedIds);
      toast.success("არჩეული პარტნიორები წარმატებით წაიშალა");
      refreshPartners();
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    } finally {
      setIsDeleting(false);
    }
  };

  // Enforce server-side result: no client-side filtering safeguard as requested.
  const filteredPartners = partners;

  return (
    <div className="partner-listing-page">
      <div className="page-header">
        <h1>პარტნიორების სია</h1>
        <div className="tabs">
          <button
            onClick={() => handleTabChange("all")}
            className={activeTab === "all" ? "active" : ""}
          >
            ყველა
          </button>
          <button
            onClick={() => handleTabChange(PartnerStatus.PENDING)}
            className={activeTab === PartnerStatus.PENDING ? "active" : ""}
          >
            მოლოდინი
          </button>
          <button
            onClick={() => handleTabChange(PartnerStatus.APPROVED)}
            className={activeTab === PartnerStatus.APPROVED ? "active" : ""}
          >
            დადასტურებული
          </button>
          <button
            onClick={() => handleTabChange(PartnerStatus.BANNED)}
            className={activeTab === PartnerStatus.BANNED ? "active" : ""}
          >
            დაბლოკილი
          </button>
        </div>
      </div>

      <div className="list-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="ძებნა კომპანიის სახელით ან მეილით..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {partners.length > 0 && (
          <div className="bulk-actions">
            <label className="select-all">
              <input
                type="checkbox"
                checked={
                  partners.length > 0 && selectedIds.length === partners.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              ყველას მონიშვნა
            </label>

            {selectedIds.length > 0 && (
              <button
                className="bulk-delete-btn"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "იშლება..." : `წაშლა (${selectedIds.length})`}
              </button>
            )}
          </div>
        )}
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
              <PartnerCard
                key={partner._id}
                partner={partner}
                onDelete={refreshPartners}
                isSelected={selectedIds.includes(partner._id)}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                წინა
              </button>
              <span className="page-info">
                გვერდი {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                შემდეგი
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

