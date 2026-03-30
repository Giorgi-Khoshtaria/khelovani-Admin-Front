import React from "react";
import "./ProductDescription.scss";

interface ProductDescriptionProps {
  descriptionGe: string;
  descriptionEn?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  descriptionGe,
  descriptionEn,
}) => {
  return (
    <div className="product-description-section">
      <div className="desc-block">
        <h3>აღწერა / Description</h3>
        <p className="ge">{descriptionGe}</p>
      </div>
      {descriptionEn && (
        <div className="desc-block en">
          <p className="en-text">{descriptionEn}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
