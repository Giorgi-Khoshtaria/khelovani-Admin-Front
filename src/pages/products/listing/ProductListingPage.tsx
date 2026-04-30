import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProductListing } from "@/hooks/products/useProductListing";
import "./ProductListingPage.scss";
import type { Product } from "@/types/productTypes";
import { ProductFilters } from "@/components/products/listing/ProductFilters";
import { ProductListHeader } from "@/components/products/listing/ProductListHeader";
import { ProductTableRow } from "@/components/products/listing/ProductTableRow";

export default function ProductListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    products,
    loading,
    search,
    setSearch,
    category,
    setCategory,
    selectedPartnerId,
    setSelectedPartnerId,
    partners,
    isAdmin,
    handleDelete,
    handlePin,
    handleToggleVisibility,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
  } = useProductListing(id);

  const onDelete = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await handleDelete(productId);
  };

  const onToggle = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    await handleToggleVisibility(product);
  };

  const onPin = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    await handlePin(product);
  };

  const isProfileMode = location.pathname.startsWith("/profile");

  const onEdit = (productId: string) => {
    const editPath = isProfileMode
      ? `/profile/products/${productId}/edit`
      : `/partners/${id}/products/${productId}/edit`;
    navigate(editPath);
  };

  const onRowClick = (product: Product) => {
    if (isProfileMode) {
      navigate(`/profile/products/${product._id}`);
    } else {
      navigate(
        id
          ? `/partners/${id}/products/${product._id}`
          : `/products/${product._id}`,
      );
    }
  };

  return (
    <div className="product-listing-page">
      <div className="page-header">
        <div className="header-title">
          {(isProfileMode || id || !isAdmin) && (
            <button
              className="back-btn"
              onClick={() => {
                if (isProfileMode) navigate("/profile");
                else navigate(id ? `/partners/${id}` : "/partners");
              }}
            >
              ← უკან{" "}
              {isProfileMode
                ? "პროფილზე"
                : id
                  ? "პარტნიორის პროფილზე"
                  : "პარტნიორების სიაზე"}
            </button>
          )}
          <h1>{id || isProfileMode ? "პროდუქტები" : "ყველა პროდუქტი"}</h1>
          {totalCount > 0 && <span className="count-badge">{totalCount}</span>}
        </div>
        {!isAdmin && (id || isProfileMode) && (
          <button
            className="add-product-btn"
            onClick={() =>
              navigate(
                isProfileMode
                  ? "/profile/products/add"
                  : `/partners/${id}/products/add`,
              )
            }
          >
            + პროდუქტის დამატება
          </button>
        )}
      </div>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        isAdmin={isAdmin}
        id={id}
        selectedPartnerId={selectedPartnerId}
        onPartnerChange={setSelectedPartnerId}
        partners={partners}
      />

      {loading ? (
        <div className="loading">იტვირთება...</div>
      ) : products.length === 0 ? (
        <div className="empty-state card">
          <p>პროდუქტები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="products-list card">
          <ProductListHeader />

          {products.map((product) => (
            <ProductTableRow
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onPin={onPin}
              onRowClick={() => onRowClick(product)}
            />
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p: number) => Math.max(1, p - 1))
                }
              >
                წინა
              </button>
              <span className="page-info">
                გვერდი {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p: number) => Math.min(totalPages, p + 1))
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
