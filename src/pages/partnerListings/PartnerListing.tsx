import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PartnerCard from "../../components/partners/PartnerCard/PartnerCard";
import type { PartnerData } from "@/types/partner.types";
import { PartnerTypeEnum, type PartnerType } from "@/types/partner.types";
import { PartnerStatus } from "@/types/partnerStatus";
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
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<PartnerType | "">("");
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
          partnerTypeFilter,
        );
        setPartners(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (err) {
        setError(getErrorMessage(err, "პარტნიორების ჩატვირთვა ვერ მოხერხდა"));
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [debouncedQuery, activeTab, currentPage, partnerTypeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, activeTab, partnerTypeFilter]);

  const refreshPartners = async () => {
    try {
      const data = await getAllPartnerRequest(
        debouncedQuery,
        activeTab,
        currentPage,
        limit,
        partnerTypeFilter,
      );
      setPartners(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
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
      !window.confirm(`ნამდვილად გსურთ ${selectedIds.length} პარტნიორის წაშლა?`)
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

  // Enforce server-side result + client-side sorting
  const filteredPartners = [...partners].sort((a, b) => {
    // Pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then newly registered (descending createdAt)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="partner-listing-page">
      <div className="page-header">
        <h1>პარტნიორების სია</h1>
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

        <div className="filters-group">
          <div className="filter-item">
            <label htmlFor="status-filter">სტატუსი:</label>
            <select
              id="status-filter"
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value as "all" | PartnerStatus)}
              className="filter-select"
            >
              <option value="all">ყველა</option>
              <option value={PartnerStatus.PENDING}>მოლოდინი</option>
              <option value={PartnerStatus.APPROVED}>დადასტურებული</option>
              <option value={PartnerStatus.BANNED}>დაბლოკილი</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="type-filter">ტიპი:</label>
            <select
              id="type-filter"
              value={partnerTypeFilter}
              onChange={(e) => setPartnerTypeFilter(e.target.value as PartnerType | "")}
              className="filter-select"
            >
              <option value="">ყველა ტიპი</option>
              <option value={PartnerTypeEnum.ORGANIZATION}>🏢 კომპანია</option>
              <option value={PartnerTypeEnum.INDIVIDUAL}>👤 ბრენდი</option>
            </select>
          </div>
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
                isAdmin={true}
                onUpdate={(updated) => {
                  setPartners((prev) =>
                    prev.map((p) => p._id === partner._id ? { ...p, ...updated } : p)
                  );
                  if (updated.isPinned !== undefined) refreshPartners();
                }}
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
