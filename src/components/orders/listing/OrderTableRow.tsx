import { useState } from "react";
import type {
  Order,
  OrderItem,
  OrderUser,
  OrderPartner,
} from "@/types/orderTypes";
import "./OrderTableRow.scss";

const STATUS_LABEL: Record<string, string> = {
  paid: "გადახდილი",
  delivered: "მიწოდებული",
  cancelled: "გაუქმებული",
};

interface Props {
  order: Order;
  /** Partner self-view — shows the deliver action, hides the organisation. */
  isProfileMode: boolean;
  onDeliver: (orderId: string) => void;
}

export const OrderTableRow = ({ order, isProfileMode, onDeliver }: Props) => {
  const [open, setOpen] = useState(false);

  const user = typeof order.user === "object" ? (order.user as OrderUser) : null;
  const partner =
    typeof order.partner === "object" ? (order.partner as OrderPartner) : null;

  const customerName =
    user?.nameGe || user?.nameEn || user?.email || "—";
  const orgName = partner?.companyNameGe || partner?.companyNameEn || "";
  const date = new Date(order.placedAt || order.createdAt).toLocaleDateString(
    "ka-GE",
    { year: "numeric", month: "short", day: "numeric" },
  );
  const canDeliver = isProfileMode && order.status === "paid";

  return (
    <div className={`order-row ${open ? "open" : ""}`}>
      <div
        className="order-row__main"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
      >
        <div className="order-row__lead">
          <span className="order-row__number">{order.orderNumber}</span>
          <span className="order-row__sub">
            {customerName}
            {!isProfileMode && orgName ? ` · ${orgName}` : ""}
          </span>
        </div>
        <div className="order-row__meta">
          <span className="order-row__items">{order.itemsCount} ც.</span>
          <span className="order-row__total">₾{order.total}</span>
          <span className={`order-row__badge order-row__badge--${order.status}`}>
            {STATUS_LABEL[order.status] || order.status}
          </span>
          <span className="order-row__date">{date}</span>
          {canDeliver && (
            <button
              type="button"
              className="order-row__deliver"
              onClick={(e) => {
                e.stopPropagation();
                onDeliver(order._id);
              }}
            >
              მიწოდებულად მონიშვნა
            </button>
          )}
          <span className="order-row__chevron" aria-hidden="true">
            ▾
          </span>
        </div>
      </div>

      {open && (
        <div className="order-row__detail">
          <ul className="order-row__items-list">
            {order.items.map((it: OrderItem, i: number) => (
              <li key={`${it.product}-${i}`} className="order-row__item">
                {it.image && <img src={it.image} alt="" />}
                <div className="order-row__item-body">
                  <span className="order-row__item-name">
                    {it.titleGe || it.titleEn}
                  </span>
                  <span className="order-row__item-qty">× {it.quantity}</span>
                </div>
                <span className="order-row__item-price">
                  ₾{it.unitPrice * it.quantity}
                </span>
              </li>
            ))}
          </ul>
          <div className="order-row__info">
            <div className="order-row__info-block">
              <span className="order-row__info-label">მომხმარებელი · Customer</span>
              <span className="order-row__info-value">
                {order.contact?.person || customerName}
              </span>
              {(order.contact?.email || user?.email) && (
                <span className="order-row__info-sub">
                  {order.contact?.email || user?.email}
                </span>
              )}
              {order.contact?.phone && (
                <span className="order-row__info-sub">{order.contact.phone}</span>
              )}
            </div>

            {!isProfileMode && (
              <div className="order-row__info-block">
                <span className="order-row__info-label">პარტნიორი · Partner</span>
                <span className="order-row__info-value">{orgName || "—"}</span>
              </div>
            )}

            <div className="order-row__info-block">
              <span className="order-row__info-label">მისამართი · Address</span>
              <span className="order-row__info-value">
                {order.shippingAddress?.addressLine}
              </span>
              <span className="order-row__info-sub">
                {order.shippingAddress?.city}
                {order.shippingAddress?.postalCode
                  ? `, ${order.shippingAddress.postalCode}`
                  : ""}
              </span>
              {order.shippingAddress?.additionalComment && (
                <span className="order-row__info-sub">
                  {order.shippingAddress.additionalComment}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
