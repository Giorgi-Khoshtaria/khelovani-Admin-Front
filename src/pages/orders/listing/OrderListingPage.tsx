import { useLocation } from "react-router-dom";
import { useOrderListing } from "@/hooks/orders/useOrderListing";
import { OrderFilters } from "@/components/orders/listing/OrderFilters";
import { OrderTableRow } from "@/components/orders/listing/OrderTableRow";
import "./OrderListingPage.scss";

export default function OrderListingPage() {
  const location = useLocation();
  const isProfileMode = location.pathname.startsWith("/profile");
  const o = useOrderListing(isProfileMode);

  return (
    <div className="order-listing-page">
      <div className="page-header">
        <div className="header-title">
          <h1>{isProfileMode ? "ჩემი შეკვეთები" : "ყველა შეკვეთა"}</h1>
          {o.totalCount > 0 && <span className="count-badge">{o.totalCount}</span>}
        </div>
      </div>

      <OrderFilters
        search={o.search}
        onSearchChange={o.setSearch}
        status={o.status}
        onStatusChange={o.setStatus}
        counts={o.counts}
      />

      {o.loading ? (
        <div className="loading">იტვირთება...</div>
      ) : o.orders.length === 0 ? (
        <div className="empty-state card">
          <p>შეკვეთები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="orders-list">
          {o.orders.map((order) => (
            <OrderTableRow
              key={order._id}
              order={order}
              isProfileMode={isProfileMode}
              onDeliver={o.markDelivered}
            />
          ))}

          {o.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={o.currentPage === 1}
                onClick={() => o.setCurrentPage((p) => Math.max(1, p - 1))}
              >
                წინა
              </button>
              <span className="page-info">
                გვერდი {o.currentPage} / {o.totalPages}
              </span>
              <button
                disabled={o.currentPage === o.totalPages}
                onClick={() =>
                  o.setCurrentPage((p) => Math.min(o.totalPages, p + 1))
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
