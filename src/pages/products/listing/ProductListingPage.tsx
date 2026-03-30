import { useParams, useNavigate } from "react-router-dom";
import { useProductListing } from "@/hooks/products/useProductListing";
import "./ProductListingPage.scss";
import type { Product } from "@/types/productTypes";
import { ProductFilters } from "@/components/products/listing/ProductFilters";
import { ProductListHeader } from "@/components/products/listing/ProductListHeader";
import { ProductTableRow } from "@/components/products/listing/ProductTableRow";

export default function ProductListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    handleToggleVisibility,
  } = useProductListing(id);

  const onDelete = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    await handleDelete(productId);
  };

  const onToggle = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    await handleToggleVisibility(product);
  };

  const onEdit = (productId: string) => {
    navigate(`/partners/${id}/products/${productId}/edit`);
  };

  const onRowClick = (product: Product) => {
    navigate(id ? `/partners/${id}/products/${product._id}` : `/products/${product._id}`);
  };

  return (
    <div className="product-listing-page">
      <div className="page-header">
        <div className="header-title">
          <button className="back-btn" onClick={() => navigate(id ? `/partners/${id}` : "/partners")}>
            ← უკან {id ? "პროფილზე" : "პარტნიორების სიაზე"}
          </button>
          <h1>{id ? "პროდუქტები / Products" : "ყველა პროდუქტი / All Products"}</h1>
        </div>
        {!isAdmin && id && (
          <button className="add-product-btn" onClick={() => navigate(`/partners/${id}/products/add`)}>
            + პროდუქტის დამატება / Add Product
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
        <div className="loading">იტვირთება... / Loading...</div>
      ) : products.length === 0 ? (
        <div className="empty-state card">
          <p>პროდუქტები ვერ მოიძებნა / No products found.</p>
        </div>
      ) : (
        <div className="products-list card">
          <ProductListHeader />

          {products.map(product => (
            <ProductTableRow 
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onRowClick={() => onRowClick(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
