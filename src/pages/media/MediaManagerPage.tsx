import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import type { MediaItem, MediaOrganization } from "@/types/media.types";
import {
  getMediaOrganizationsRequest,
  getMediaRequest,
} from "@/apiCalls/mediaApiCalls";
import MediaCard from "@/components/mediaManager/MediaCard";
import UploadModal from "@/components/mediaManager/UploadModal";
import MediaLightbox from "@/components/mediaManager/MediaLightbox";
import MediaFilters, {
  type MediaFilterValues,
} from "@/components/mediaManager/MediaFilters";
import MediaPagination from "@/components/mediaManager/MediaPagination";
import MediaBulkBar from "@/components/mediaManager/MediaBulkBar";
import "./MediaManagerPage.scss";

const PAGE_SIZE = 30;

const EMPTY_FILTERS: MediaFilterValues = {
  orgId: "",
  search: "",
  dateFrom: "",
  dateTo: "",
};

export default function MediaManagerPage() {
  const { token } = usePartnerContext();
  const decoded = parseJwt(token || "");
  const role = (decoded?.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const permissions: string[] = decoded?.permissions || [];
  const ownOrgId: string | undefined = decoded?.id;

  const canManage =
    isAdmin ||
    permissions.includes("media.manage") ||
    permissions.includes("organization.media.manage");

  // ─── Data state ────────────────────────────────────────────────
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<MediaOrganization[]>([]);

  // ─── Pagination ────────────────────────────────────────────────
  // Cloudinary search is cursor-based (no page offsets), so we keep a stack
  // of cursors — cursorsRef.current[i] fetches page i. Page 0 has no cursor.
  const [pageIndex, setPageIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const cursorsRef = useRef<(string | undefined)[]>([undefined]);

  // ─── Mutation tombstones ───────────────────────────────────────
  // Cloudinary's search index lags a few seconds after rename/delete, so
  // a fresh fetch can re-show stale data. These remember what we just
  // changed locally so we can filter / remap stale results in flight.
  const deletedIdsRef = useRef<Set<string>>(new Set());
  const renamedMapRef = useRef<Map<string, MediaItem>>(new Map());

  // ─── Filters ───────────────────────────────────────────────────
  // The page holds the canonical filter values; MediaFilters owns the
  // search-input debounce and emits normalised values back here.
  const [filterValues, setFilterValues] =
    useState<MediaFilterValues>(EMPTY_FILTERS);

  // ─── UI state ──────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploadOpen, setUploadOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const orgNameById = useMemo(() => {
    const map: Record<string, string> = {};
    organizations.forEach((o) => (map[o.id] = o.name));
    return map;
  }, [organizations]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Load org list once (admin only).
  useEffect(() => {
    if (!isAdmin) return;
    getMediaOrganizationsRequest()
      .then(setOrganizations)
      .catch(() => toast.error("ორგანიზაციების ჩატვირთვა ვერ მოხერხდა"));
  }, [isAdmin]);

  const apiFilters = useMemo(
    () => ({
      orgId: isAdmin ? filterValues.orgId || undefined : undefined,
      search: filterValues.search || undefined,
      dateFrom: filterValues.dateFrom || undefined,
      dateTo: filterValues.dateTo || undefined,
      limit: PAGE_SIZE,
    }),
    [isAdmin, filterValues],
  );

  // Keep latest filters available to fetchPage without re-creating it.
  const filtersRef = useRef(apiFilters);
  filtersRef.current = apiFilters;

  // Apply local tombstones to a freshly fetched page — drops items the
  // user just deleted, and swaps in the new copy of items they renamed.
  const reconcileWithTombstones = useCallback(
    (incoming: MediaItem[]): MediaItem[] =>
      incoming
        .filter((it) => !deletedIdsRef.current.has(it.publicId))
        .map((it) => renamedMapRef.current.get(it.publicId) ?? it),
    [],
  );

  // Fetch a specific page using its stored cursor.
  const fetchPage = useCallback(
    async (index: number, opts: { silent?: boolean } = {}) => {
      if (!opts.silent) {
        setLoading(true);
        setSelected(new Set());
      }
      try {
        const res = await getMediaRequest({
          ...filtersRef.current,
          cursor: cursorsRef.current[index],
        });
        setItems(reconcileWithTombstones(res.items));
        setTotalCount(
          Math.max(0, res.totalCount - deletedIdsRef.current.size),
        );
        setNextCursor(res.nextCursor);
        if (res.nextCursor) {
          cursorsRef.current[index + 1] = res.nextCursor;
        }
        setPageIndex(index);
      } catch (err) {
        if (!opts.silent) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message;
          toast.error(msg || "მედიის ჩატვირთვა ვერ მოხერხდა");
        }
      } finally {
        if (!opts.silent) setLoading(false);
      }
    },
    [reconcileWithTombstones],
  );

  /** Silent background refresh of the current page — used after mutations. */
  const refreshCurrentPage = useCallback(() => {
    void fetchPage(pageIndex, { silent: true });
  }, [fetchPage, pageIndex]);

  // Any filter change resets pagination + tombstones and reloads from page 0.
  useEffect(() => {
    cursorsRef.current = [undefined];
    deletedIdsRef.current = new Set();
    renamedMapRef.current = new Map();
    fetchPage(0);
  }, [apiFilters, fetchPage]);

  const goToPage = (index: number) => {
    if (loading || index < 0) return;
    fetchPage(index);
  };

  // ─── List sync callbacks (cards/modals own the requests) ───────
  const handleRenamed = (updated: MediaItem, oldPublicId: string) => {
    renamedMapRef.current.set(oldPublicId, updated);
    setItems((prev) =>
      prev.map((it) => (it.publicId === oldPublicId ? updated : it)),
    );
    refreshCurrentPage();
  };

  /** Prune given publicIds from local state + handle empty-page case. */
  const pruneItems = useCallback(
    (publicIds: string[]) => {
      publicIds.forEach((id) => deletedIdsRef.current.add(id));
      const removed = new Set(publicIds);
      const remaining = items.filter((it) => !removed.has(it.publicId));
      setTotalCount((c) => Math.max(0, c - publicIds.length));
      setSelected((prev) => {
        const next = new Set(prev);
        publicIds.forEach((id) => next.delete(id));
        return next;
      });
      if (remaining.length === 0 && pageIndex > 0) {
        fetchPage(pageIndex - 1);
      } else {
        setItems(remaining);
        refreshCurrentPage();
      }
    },
    [items, pageIndex, fetchPage, refreshCurrentPage],
  );

  const handleDeleted = (publicId: string) => pruneItems([publicId]);
  const handleBulkDeleted = (publicIds: string[]) => pruneItems(publicIds);

  const handleUploaded = (uploaded: MediaItem[]) => {
    setUploadOpen(false);
    setTotalCount((c) => c + uploaded.length);
    if (pageIndex === 0) {
      setItems((prev) => {
        const seen = new Set(uploaded.map((u) => u.publicId));
        return [...uploaded, ...prev.filter((it) => !seen.has(it.publicId))];
      });
    } else {
      cursorsRef.current = [undefined];
      fetchPage(0);
    }
  };

  const toggleSelect = (publicId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) {
        next.delete(publicId);
      } else {
        next.add(publicId);
      }
      return next;
    });
  };

  const hasFilters = !!(
    filterValues.orgId ||
    filterValues.search ||
    filterValues.dateFrom ||
    filterValues.dateTo
  );

  return (
    <div className="media-page">
      <header className="media-page__header">
        <div>
          <h1>მედია მენეჯერი</h1>
          <p className="media-page__subtitle">
            {isAdmin
              ? "ყველა ორგანიზაციის სურათების მართვა"
              : "თქვენი ორგანიზაციის სურათების მართვა"}
          </p>
        </div>
        {canManage && (
          <button className="btn-primary" onClick={() => setUploadOpen(true)}>
            + ატვირთვა
          </button>
        )}
      </header>

      <MediaFilters
        isAdmin={isAdmin}
        organizations={organizations}
        totalCount={totalCount}
        value={filterValues}
        onChange={setFilterValues}
      />

      {canManage && (
        <MediaBulkBar
          selectedIds={[...selected]}
          onClear={() => setSelected(new Set())}
          onBulkDeleted={handleBulkDeleted}
        />
      )}

      {loading ? (
        <div className="media-state">იტვირთება...</div>
      ) : items.length === 0 ? (
        <div className="media-state">
          {hasFilters
            ? "ფილტრს არცერთი ფაილი არ ემთხვევა"
            : "ჯერ არცერთი ფაილი არ არის ატვირთული"}
        </div>
      ) : (
        <>
          <div className="media-grid">
            {items.map((item, index) => (
              <MediaCard
                key={item.publicId}
                item={item}
                showOrg={isAdmin}
                orgName={item.orgId ? orgNameById[item.orgId] : undefined}
                selected={selected.has(item.publicId)}
                canManage={canManage}
                onToggleSelect={toggleSelect}
                onView={() => setLightboxIndex(index)}
                onRenamed={handleRenamed}
                onDeleted={handleDeleted}
              />
            ))}
          </div>

          <MediaPagination
            pageIndex={pageIndex}
            totalPages={totalPages}
            canNext={!!nextCursor}
            loading={loading}
            onPrev={() => goToPage(pageIndex - 1)}
            onNext={() => goToPage(pageIndex + 1)}
          />
        </>
      )}

      {uploadOpen && (
        <UploadModal
          isAdmin={isAdmin}
          organizations={organizations}
          presetOrgId={
            isAdmin ? filterValues.orgId || undefined : ownOrgId
          }
          onClose={() => setUploadOpen(false)}
          onUploaded={handleUploaded}
        />
      )}

      {lightboxIndex !== null && items[lightboxIndex] && (
        <MediaLightbox
          item={items[lightboxIndex]}
          orgName={
            items[lightboxIndex].orgId
              ? orgNameById[items[lightboxIndex].orgId!]
              : undefined
          }
          onClose={() => setLightboxIndex(null)}
          onPrev={
            lightboxIndex > 0
              ? () => setLightboxIndex(lightboxIndex - 1)
              : undefined
          }
          onNext={
            lightboxIndex < items.length - 1
              ? () => setLightboxIndex(lightboxIndex + 1)
              : undefined
          }
        />
      )}
    </div>
  );
}
