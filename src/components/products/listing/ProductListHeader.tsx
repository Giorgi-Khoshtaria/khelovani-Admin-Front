import React from "react";
import "./ProductListHeader.scss";

export const ProductListHeader: React.FC = () => {
  return (
    <div className="list-header">
      <div className="col-image"><span>სურათი</span><small>Image</small></div>
      <div className="col-info"><span>ინფორმაცია</span><small>Info</small></div>
      <div className="col-category"><span>კატეგორია</span><small>Category</small></div>
      <div className="col-status"><span>სტატუსი</span><small>Status</small></div>
      <div className="col-price"><span>ფასი</span><small>Price</small></div>
      <div className="col-stock"><span>მარაგი</span><small>Stock</small></div>
      <div className="col-actions"><span>მოქმედება</span><small>Actions</small></div>
    </div>
  );
};
