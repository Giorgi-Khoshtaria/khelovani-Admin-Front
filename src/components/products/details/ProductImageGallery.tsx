import React, { useState } from "react";
import "./ProductImageGallery.scss";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-image-gallery">
      <div className="main-image-container">
        <div className="main-image">
          <img src={images[activeIndex]} alt="Product" />
        </div>

        {images.length > 1 && (
          <>
            <button
              className="nav-btn prev"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="nav-btn next"
              onClick={handleNext}
              aria-label="Next image"
            >
              ›
            </button>
            <div className="image-counter">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="thumbnails">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`thumbnail ${activeIndex === idx ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
            >
              <img src={img} alt={`Thumbnail ${idx}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
