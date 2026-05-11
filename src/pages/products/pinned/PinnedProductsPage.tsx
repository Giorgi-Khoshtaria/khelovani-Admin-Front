import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPinnedProductsRequest, type PinnedProductsGrouped } from "@/apiCalls/partnerApiCalls/getPinnedProducts.req";
import { updateProductPinRequest } from "@/apiCalls/partnerApiCalls/pinProduct.req";
import { getErrorMessage } from "@/utils/handleApiError";
import type { Product, PinSection } from "@/types/productTypes";
import { PRODUCT_CONDITIONS, CONDITION_LABELS } from "@/types/productTypes";
import { ProductListHeader } from "@/components/products/listing/ProductListHeader";
import { PIN_CAP_PER_SECTION } from "./pinnedProductsConstants";
import "@/components/products/listing/ProductTableRow.scss";
import "./PinnedProductsPage.scss";
import useCategoryOptions from "@/hooks/categories/useCategoryOptions";

export default function PinnedProductsPage() {
  const navigate = useNavigate();
  const [grouped, setGrouped] = useState<PinnedProductsGrouped | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<PinSection>(PRODUCT_CONDITIONS[0]);

  const fetchPinned = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPinnedProductsRequest();
      setGrouped(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "პინ-პროდუქტების ჩატვირთვა ვერ მოხერხდა"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPinned(); }, [fetchPinned]);

  const handleUnpin = async (product: Product) => {
    try {
      await updateProductPinRequest(product._id, null);
      toast.success("პინი მოიხსნა");
      fetchPinned();
    } catch (err) {
      toast.error(getErrorMessage(err, "მოქმედება ვერ შესრულდა"));
    }
  };

  const items: Product[] = grouped ? (grouped[activeSection] ?? []) : [];
  const pinned = items.filter((p) => p.pinSection === activeSection);
  const autoFilled = items.filter((p) => p.pinSection !== activeSection);

  return (
    <div className="pinned-products-page">
      <div className="page-header">
        <div className="header-title">
          <h1>პინ-პროდუქტები</h1>
          <span className="page-subtitle">
            მაქსიმუმ {PIN_CAP_PER_SECTION} პინი სექციაში
          </span>
        </div>
      </div>

      <div className="section-tabs">
        {PRODUCT_CONDITIONS.map((section) => {
          const count = grouped
            ? (grouped[section] ?? []).filter((p) => p.pinSection === section).length
            : 0;
          return (
            <button
              key={section}
              className={`section-tab${activeSection === section ? " active" : ""}`}
              onClick={() => setActiveSection(section)}
            >
              {CONDITION_LABELS[section].ge}
              <small>{CONDITION_LABELS[section].en}</small>
              <span className="tab-count">{count} / {PIN_CAP_PER_SECTION}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="loading">იტვირთება...</div>
      ) : items.length === 0 ? (
        <div className="empty-state card">
          <p>პროდუქტები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="products-list card">
          <ProductListHeader />

          {pinned.map((product) => (
            <PinnedRow
              key={product._id}
              product={product}
              isAutoFill={false}
              onUnpin={() => handleUnpin(product)}
              onRowClick={() => navigate(`/products/${product._id}`)}
            />
          ))}

          {autoFilled.length > 0 && (
            <>
              <div className="autofill-divider">
                <span>ავტო-შევსება / Auto-filled</span>
              </div>
              {autoFilled.map((product) => (
                <PinnedRow
                  key={product._id}
                  product={product}
                  isAutoFill
                  onRowClick={() => navigate(`/products/${product._id}`)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface PinnedRowProps {
  product: Product;
  isAutoFill: boolean;
  onUnpin?: () => void;
  onRowClick: () => void;
}

function truncate(text: string | undefined, max = 50) {
  if (!text) return "";
  return text.length > max ? text.substring(0, max).trim() + "…" : text;
}

function PinnedRow({ product, isAutoFill, onUnpin, onRowClick }: PinnedRowProps) {
  const { getLabel } = useCategoryOptions();

  return (
    <div
      className={`product-row${isAutoFill ? " is-autofill" : ""}`}
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
          {isAutoFill ? (
            <span className="autofill-badge">auto</span>
          ) : (
            <button
              className="action-btn unpin-btn"
              onClick={onUnpin}
              title="პინის მოხსნა"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M15 4.5l-6 6L5 12l7 7 1.5-4.5 6-6"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
