import React, { useState, useRef, useEffect } from "react";
import "./ProductTableRow.scss";
import type { Product, PinSection } from "@/types/productTypes";
import { CONDITION_LABELS } from "@/types/productTypes";
import useCategoryOptions from "@/hooks/categories/useCategoryOptions";

interface ProductTableRowProps {
  product: Product;
  isAdmin: boolean;
  onToggle: (e: React.MouseEvent, product: Product) => void;
  onDelete: (e: React.MouseEvent, productId: string) => void;
  onEdit: (productId: string) => void;
  onRowClick: () => void;
  onPin?: (e: React.MouseEvent, product: Product, pinSection: PinSection | null) => void;
}

const truncate = (text: string | undefined, maxLength = 50): string => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength).trim() + "..." : text;
};

function getCompatibleSections(product: Product): PinSection[] {
  return [product.condition];
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  isAdmin,
  onToggle,
  onDelete,
  onEdit,
  onRowClick,
  onPin,
}) => {
  const { getLabel } = useCategoryOptions();
  const [pinMenuOpen, setPinMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPinMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pinMenuOpen]);

  const isPinned = !!product.pinSection;
  const compatibleSections = getCompatibleSections(product);

  return (
    <div
      className={`product-row${!product.isShown ? " is-hidden" : ""}${isPinned ? " is-pinned" : ""}`}
      onClick={onRowClick}
    >
      <div className="col-image">
        <div className="thumbnail">
          <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.titleGe} />
        </div>
      </div>

      <div className="col-info">
        <div className="title-stack">
          <span className="title-ge" title={product.titleGe}>
            {truncate(product.titleGe)}
          </span>
          <span className="title-en" title={product.titleEn}>
            {truncate(product.titleEn)}
          </span>
          <div className="badges-row">
            {isPinned && product.pinSection && (
              <span className="pin-badge">
                📌 {CONDITION_LABELS[product.pinSection].ge}
              </span>
            )}
            {isAdmin && product.ownerType && (
              <span className={`owner-type-badge owner-type-badge--${product.ownerType}`}>
                {product.ownerType === "individual" ? "👤 ფიზიკური პირი" : "🏢 ორგანიზაცია"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="col-category">
        <span className="category-badge">{getLabel(product.category)}</span>
      </div>

      <div className="col-status">
        <span className={`status-pill ${product.isShown ? "visible" : "hidden"}`}>
          {product.isShown ? "საჯარო" : "დამალული"}
        </span>
      </div>

      <div className="col-price">
        <span className="price">{product.price} {product.currency || "GEL"}</span>
      </div>

      <div className="col-stock">
        <span className={`stock-level ${product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}>
          {product.stockQuantity}
        </span>
      </div>

      <div className="col-actions" onClick={(e) => e.stopPropagation()}>
        <div className="action-buttons">
          {isAdmin ? (
            <>
              <div className="pin-menu-wrapper" ref={menuRef}>
                <button
                  className={`action-btn pin-btn ${isPinned ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPinned) {
                      onPin?.(e, product, null);
                    } else {
                      setPinMenuOpen((o) => !o);
                    }
                  }}
                  disabled={!product.isShown}
                  title={!product.isShown ? "დამალული პროდუქტის პინი შეუძლებელია" : isPinned ? "პინის მოხსნა" : "პინის სექცია"}
                >
                  {isPinned ? "📌" : "📍"}
                </button>
                {pinMenuOpen && (
                  <div className="pin-dropdown">
                    {compatibleSections.map((section) => (
                      <button
                        key={section}
                        className={`pin-option${product.pinSection === section ? " active" : ""}`}
                        onClick={(e) => { onPin?.(e, product, section); setPinMenuOpen(false); }}
                      >
                        {CONDITION_LABELS[section].ge} / {CONDITION_LABELS[section].en}
                      </button>
                    ))}
                    {isPinned && (
                      <button
                        className="pin-option pin-option--unpin"
                        onClick={(e) => { onPin?.(e, product, null); setPinMenuOpen(false); }}
                      >
                        ❌ პინის მოხსნა
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button
                className={`action-btn toggle-btn ${product.isShown ? "is-visible" : "is-hidden-state"}`}
                onClick={(e) => onToggle(e, product)}
                title={product.isShown ? "დამალვა" : "გამოჩენა"}
              >
                {product.isShown ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </>
          ) : (
            <button
              className="action-btn edit-btn"
              onClick={(e) => { e.stopPropagation(); onEdit(product._id); }}
              title="რედაქტირება"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          <button
            className="action-btn delete-btn"
            onClick={(e) => onDelete(e, product._id)}
            title="წაშლა"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
