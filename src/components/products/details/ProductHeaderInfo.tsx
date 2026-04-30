import React from "react";
import "./ProductHeaderInfo.scss";
import useCategoryOptions from "@/hooks/categories/useCategoryOptions";

interface ProductHeaderInfoProps {
  titleGe: string;
  titleEn?: string;
  price: number;
  currency: string;
  category: string;
  stockQuantity: number;
  condition: string;
}

const ProductHeaderInfo: React.FC<ProductHeaderInfoProps> = ({
  titleGe,
  titleEn,
  price,
  currency,
  category,
  stockQuantity,
  condition,
}) => {
  const { getLabel } = useCategoryOptions();

  return (
    <div className="product-header-info">
      <div className="category-tag">{getLabel(category)}</div>
      <h1 className="title-ge">{titleGe}</h1>
      {titleEn && <h2 className="title-en">{titleEn}</h2>}

      <div className="price-stock-row">
        <div className="price-tag">
          {price.toLocaleString()} {currency}
        </div>
        <div
          className={`stock-badge ${stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
        >
          {stockQuantity > 0
            ? `მარაგშია: ${stockQuantity}`
            : "მარაგი ამოწურულია"}
        </div>
      </div>

      <div className="condition-info">
        <span>მდგომარეობა:</span> <strong>{condition}</strong>
      </div>
    </div>
  );
};

export default ProductHeaderInfo;
