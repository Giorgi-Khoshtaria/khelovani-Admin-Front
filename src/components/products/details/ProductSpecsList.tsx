import React from "react";
import "./ProductSpecsList.scss";

interface ProductSpecsListProps {
  tagsGe: string[];
  tagsEn?: string[];
  materialsGe: string[];
  materialsEn?: string[];
}

const ProductSpecsList: React.FC<ProductSpecsListProps> = ({
  tagsGe,
  tagsEn,
  materialsGe,
  materialsEn,
}) => {
  return (
    <div className="product-specs-list">
      <div className="specs-section">
        <label>მასალები / Materials</label>
        <div className="specs-row">
          <div className="spec-group">
            {materialsGe.map((m, i) => (
              <span key={i} className="spec-badge">
                {m}
              </span>
            ))}
          </div>
          {materialsEn && materialsEn.length > 0 && (
            <div className="spec-group en">
              {materialsEn.map((m, i) => (
                <span key={i} className="spec-badge en">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="specs-section">
        <label>ტეგები / Tags</label>
        <div className="specs-row">
          <div className="spec-group">
            {tagsGe.map((t, i) => (
              <span key={i} className="spec-badge tag">
                {t}
              </span>
            ))}
          </div>
          {tagsEn && tagsEn.length > 0 && (
            <div className="spec-group en">
              {tagsEn.map((t, i) => (
                <span key={i} className="spec-badge tag en">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecsList;
