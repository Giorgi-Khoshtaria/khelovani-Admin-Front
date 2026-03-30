import React from "react";
import "./ProductTableRow.scss";
import type { Product } from "@/types/productTypes";

interface ProductTableRowProps {
  product: Product;
  id?: string; // id from params
  isAdmin: boolean;
  onToggle: (e: React.MouseEvent, product: Product) => void;
  onDelete: (e: React.MouseEvent, productId: string) => void;
  onEdit: (productId: string) => void;
  onRowClick: () => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  isAdmin,
  onToggle,
  onDelete,
  onEdit,
  onRowClick,
}) => {
  return (
    <div 
      className={`product-row ${!product.isShown ? "is-hidden" : ""}`}
      onClick={onRowClick}
    >
      <div className="col-image">
        <div className="thumbnail">
          <img src={product.images[0]} alt={product.titleGe} />
        </div>
      </div>

      <div className="col-info">
        <div className="title-stack">
          <span className="title-ge">{product.titleGe}</span>
          <span className="title-en">{product.titleEn}</span>
        </div>
      </div>

      <div className="col-category">
        <span className="category-badge">{product.category}</span>
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
            <button 
              className="action-btn toggle-btn" 
              onClick={(e) => onToggle(e, product)}
              title={product.isShown ? "დამალვა / Hide" : "გამოჩენა / Show"}
            >
              {product.isShown ? "👁️‍🗨️" : "👁️"}
            </button>
          ) : (
            <button 
              className="action-btn edit-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product._id);
              }}
              title="რედაქტირება / Edit"
            >
              ✏️
            </button>
          )}
          <button 
            className="action-btn delete-btn" 
            onClick={(e) => onDelete(e, product._id)}
            title="წაშლა / Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
