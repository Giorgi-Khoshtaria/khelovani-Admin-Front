import React from "react";
import "./ProductListHeader.scss";

export const ProductListHeader: React.FC = () => {
  return (
    <div className="list-header">
      <div className="col-image">სურათი</div>
      <div className="col-info">ინფორმაცია</div>
      <div className="col-category">კატეგორია</div>
      <div className="col-status">სტატუსი</div>
      <div className="col-price">ფასი</div>
      <div className="col-stock">მარაგი</div>
      <div className="col-actions">მოქმედება</div>
    </div>
  );
};
