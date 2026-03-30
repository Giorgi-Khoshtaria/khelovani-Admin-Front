import React from "react";
import "./ProductListHeader.scss";

export const ProductListHeader: React.FC = () => {
  return (
    <div className="list-header">
      <div className="col-image">სურათი / Image</div>
      <div className="col-info">ინფორმაცია / Information</div>
      <div className="col-category">კატეგორია / Category</div>
      <div className="col-status">სტატუსი / Status</div>
      <div className="col-price">ფასი / Price</div>
      <div className="col-stock">მარაგი / Stock</div>
      <div className="col-actions">მოქმედება / Actions</div>
    </div>
  );
};
