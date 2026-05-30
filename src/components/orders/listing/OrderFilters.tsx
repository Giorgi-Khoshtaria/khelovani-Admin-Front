import type { OrderCounts, OrderStatusFilter } from "@/types/orderTypes";
import "./OrderFilters.scss";

const TABS: { value: OrderStatusFilter; label: string }[] = [
  { value: "all", label: "ყველა" },
  { value: "paid", label: "გადახდილი" },
  { value: "delivered", label: "მიწოდებული" },
  { value: "cancelled", label: "გაუქმებული" },
];

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  status: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
  counts: OrderCounts;
}

export const OrderFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  counts,
}: Props) => (
  <div className="order-filters card">
    <input
      className="order-filters__search"
      type="text"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="ძებნა შეკვეთის # ან მომხმარებლით..."
    />
    <div className="order-filters__tabs">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`order-filters__tab ${status === tab.value ? "active" : ""}`}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
          <span className="order-filters__count">{counts[tab.value]}</span>
        </button>
      ))}
    </div>
  </div>
);
