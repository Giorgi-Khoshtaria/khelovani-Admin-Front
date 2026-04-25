import { useParams, useNavigate } from "react-router-dom";
import { useProductDetails } from "@/hooks/products/useProductDetails";
import ProductImageGallery from "@/components/products/details/ProductImageGallery";
import ProductHeaderInfo from "@/components/products/details/ProductHeaderInfo";
import ProductDescription from "@/components/products/details/ProductDescription";
import ProductSpecsList from "@/components/products/details/ProductSpecsList";
import "./ProductDetailsPage.scss";

const ProductDetailsPage = () => {
  const { id: partnerId, productId } = useParams<{
    id: string;
    productId: string;
  }>();
  const { product, loading, isAdmin, handleDelete, handleToggleVisibility } =
    useProductDetails(partnerId, productId);
  const navigate = useNavigate();

  if (loading)
    return <div className="loading-state">იტვირთება... / Loading...</div>;
  if (!product)
    return (
      <div className="error-state">
        პროდუქტი ვერ მოიძებნა / Product not found.
      </div>
    );

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
            <button
              className="toggle-details-btn"
              onClick={handleToggleVisibility}
            >
              {product.isShown
                ? "დამალვა / Hide Visibility"
                : "გამოჩენა / Show Visibility"}
            </button>
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
        ></span>
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
