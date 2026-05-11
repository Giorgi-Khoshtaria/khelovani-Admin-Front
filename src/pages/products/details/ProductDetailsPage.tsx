import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useProductDetails } from "@/hooks/products/useProductDetails";
import ProductImageGallery from "@/components/products/details/ProductImageGallery";
import ProductHeaderInfo from "@/components/products/details/ProductHeaderInfo";
import ProductDescription from "@/components/products/details/ProductDescription";
import ProductSpecsList from "@/components/products/details/ProductSpecsList";
import type { PinSection } from "@/types/productTypes";
import { CONDITION_LABELS } from "@/types/productTypes";
import "./ProductDetailsPage.scss";

function getCompatibleSections(p: {
  condition: string;
  isOnSale?: boolean;
  isOneOfAKind?: boolean;
}): PinSection[] {
  return [p.condition as PinSection];
}

const ProductDetailsPage = () => {
  const { id: partnerId, productId } = useParams<{
    id: string;
    productId: string;
  }>();
  const {
    product,
    loading,
    isAdmin,
    pinning,
    handlePin,
    handleDelete,
    handleToggleVisibility,
  } = useProductDetails(partnerId, productId);
  const navigate = useNavigate();

  const [pinMenuOpen, setPinMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPinMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pinMenuOpen]);

  if (loading)
    return <div className="loading-state">იტვირთება... / Loading...</div>;
  if (!product)
    return (
      <div className="error-state">
        პროდუქტი ვერ მოიძებნა / Product not found.
      </div>
    );

  const isPinned = !!product.pinSection;
  const compatibleSections = getCompatibleSections(product);

  return (
    <div className="product-details-page">
      <div className="details-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← უკან / Back
          </button>
          <h1 className="page-title">{product.titleGe}</h1>
        </div>

        <div className="header-actions">
          {isAdmin ? (
            <>
              <div className="pin-menu-wrapper" ref={menuRef}>
                <button
                  className={`pin-details-btn${isPinned ? " active" : ""}`}
                  onClick={() => setPinMenuOpen((o) => !o)}
                  disabled={pinning || !product.isShown}
                  title={
                    !product.isShown
                      ? "დამალული პროდუქტის პინი შეუძლებელია"
                      : "პინის სექცია"
                  }
                >
                  {pinning
                    ? "..."
                    : isPinned
                      ? `📌 ${CONDITION_LABELS[product.pinSection!]?.ge}`
                      : "📍 პინი"}
                </button>
                {pinMenuOpen && (
                  <div className="pin-dropdown">
                    {compatibleSections.map((section) => (
                      <button
                        key={section}
                        className={`pin-option${product.pinSection === section ? " active" : ""}`}
                        onClick={() => {
                          handlePin(section);
                          setPinMenuOpen(false);
                        }}
                      >
                        {CONDITION_LABELS[section].ge} / {CONDITION_LABELS[section].en}
                      </button>
                    ))}
                    {isPinned && (
                      <button
                        className="pin-option pin-option--unpin"
                        onClick={() => {
                          handlePin(null);
                          setPinMenuOpen(false);
                        }}
                      >
                        ❌ პინის მოხსნა
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button
                className="toggle-details-btn"
                onClick={handleToggleVisibility}
              >
                {product.isShown
                  ? "დამალვა / Hide Visibility"
                  : "გამოჩენა / Show Visibility"}
              </button>
            </>
          ) : (
            partnerId && (
              <button
                className="edit-details-btn"
                onClick={() =>
                  navigate(`/partners/${partnerId}/products/${productId}/edit`)
                }
              >
                რედაქტირება / Edit
              </button>
            )
          )}
          <button className="delete-details-btn" onClick={handleDelete}>
            წაშლა / Delete Product
          </button>
        </div>
      </div>

      <div className="status-indicator">
        <span
          className={`status-dot ${product.isShown ? "shown" : "hidden"}`}
        />
        {product.isShown ? "საჯარო / Public" : "დამალული / Hidden"}
      </div>

      <div className="details-grid">
        <div className="left-column">
          <ProductImageGallery images={product.images} />
        </div>

        <div className="right-column">
          <div className="content-card card">
            <ProductHeaderInfo
              titleGe={product.titleGe}
              titleEn={product.titleEn}
              price={product.price}
              currency={product.currency}
              category={product.category}
              stockQuantity={product.stockQuantity}
              condition={product.condition}
            />
            <ProductDescription
              descriptionGe={product.descriptionGe}
              descriptionEn={product.descriptionEn}
            />
            <ProductSpecsList
              tagsGe={product.tagsGe}
              tagsEn={product.tagsEn}
              materialsGe={product.materialsGe}
              materialsEn={product.materialsEn}
            />

            <div className="additional-info">
              {product.isOneOfAKind && (
                <div className="info-item highlight">
                  <span className="label">უნიკალური / Unique:</span>
                  <span className="value">დიახ / Yes (One of a Kind)</span>
                </div>
              )}
              {product.isOnSale && product.discountPercent && (
                <div className="info-item highlight">
                  <span className="label">ფასდაკლება / Discount:</span>
                  <span className="value">{product.discountPercent}%</span>
                </div>
              )}
              {product.locationGe && (
                <div className="info-item">
                  <span className="label">მდებარეობა / Location:</span>
                  <span className="value">
                    {product.locationGe}{" "}
                    {product.locationEn && `(${product.locationEn})`}
                  </span>
                </div>
              )}
              <div className="info-item">
                <span className="label">ტრანსპორტირება / Shipping:</span>
                <span className="value">
                  {product.shippingAvailable
                    ? `ხელმისაწვდომია (${product.shippingPrice || 0} GEL) / Available`
                    : "არა / Not available"}
                </span>
              </div>
              {product.dimensions && (
                <div className="info-item">
                  <span className="label">ზომები / Dimensions:</span>
                  <span className="value">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="info-item">
                  <span className="label">წონა / Weight:</span>
                  <span className="value">{product.weight} კგ / kg</span>
                </div>
              )}
              <div className="info-item">
                <span className="label">დამატებულია / Added:</span>
                <span className="value">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
