import React from "react";
import "./ProductForm.scss";
import type { CreateProductInput } from "@/types/productTypes";

interface ProductFormProps {
  formData: CreateProductInput;
  tagInputs: {
    tagsGe: string;
    tagsEn: string;
    materialsGe: string;
    materialsEn: string;
  };
  errors: Record<string, string>;
  loading: boolean;
  isEdit?: boolean;
  existingImages?: string[];
  onSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleTagInputChange: (name: "tagsGe" | "tagsEn" | "materialsGe" | "materialsEn", value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  tagInputs,
  errors,
  loading,
  isEdit,
  existingImages,
  onSubmit,
  handleInputChange,
  handleTagInputChange,
  handleFileChange,
  onCancel
}) => {
  return (
    <form className="add-product-form card" onSubmit={onSubmit}>
      <div className="form-section">
        <h3>მედია / Media</h3>
        <div className="form-group row">
          <div className="form-group">
            <label>
              სურათები / Images (Max 5) {isEdit && "- Leave empty to keep existing"}
            </label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            {errors.images && <span className="error-text">{errors.images}</span>}
            
            {isEdit && existingImages && (
              <div className="existing-images-preview">
                {formData.images.length > 0 ? (
                  <p className="notice">ახალი სურათები ჩაანაცვლებს ძველს / New images will replace old ones</p>
                ) : (
                  existingImages.map((img, i) => (
                    <img key={i} src={img} className="mini-preview" alt="existing" />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>ძირითადი ინფორმაცია / Basic Info</h3>
        <div className="form-group row">
          <div className="form-group">
            <label>სათაური (GE) *</label>
            <input type="text" name="titleGe" value={formData.titleGe} onChange={handleInputChange} />
            {errors.titleGe && <span className="error-text">{errors.titleGe}</span>}
          </div>
          <div className="form-group">
            <label>სათაური (EN)</label>
            <input type="text" name="titleEn" value={formData.titleEn} onChange={handleInputChange} />
            {errors.titleEn && <span className="error-text">{errors.titleEn}</span>}
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group">
            <label>აღწერა (GE) *</label>
            <textarea name="descriptionGe" value={formData.descriptionGe} onChange={handleInputChange} rows={3} />
            {errors.descriptionGe && <span className="error-text">{errors.descriptionGe}</span>}
          </div>
          <div className="form-group">
            <label>აღწერა (EN)</label>
            <textarea name="descriptionEn" value={formData.descriptionEn} onChange={handleInputChange} rows={3} />
            {errors.descriptionEn && <span className="error-text">{errors.descriptionEn}</span>}
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group">
            <label>კატეგორია / Category *</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              <option value="jewelry_accessories">Jewelry & Accessories</option>
              <option value="textiles_fabric">Textiles & Fabric</option>
              <option value="ceramics_pottery">Ceramics & Pottery</option>
              <option value="woodwork">Woodwork</option>
              <option value="metalwork">Metalwork</option>
              <option value="leather_goods">Leather Goods</option>
              <option value="home_decor">Home Decor</option>
              <option value="art_prints">Art Prints</option>
              <option value="natural_wellness">Natural Wellness</option>
              <option value="toys_gifts">Toys & Gifts</option>
              <option value="food_drink">Food & Drink</option>
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
          <div className="form-group">
            <label>მდგომარეობა / Condition *</label>
            <select name="condition" value={formData.condition} onChange={handleInputChange}>
              <option value="new">ახალი / New</option>
              <option value="handmade">ხელნაკეთი / Handmade</option>
              <option value="vintage">ვინტაჟი / Vintage</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>ფასი და მარაგი / Pricing & Stock</h3>
        <div className="form-group row">
          <div className="form-group">
            <label>ფასი (GEL) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} onWheel={(e) => (e.target as HTMLInputElement).blur()} />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label>ხილვადობა / Visibility</label>
            <select name="isShown" value={formData.isShown.toString()} onChange={(e) => {
              const val = e.target.value === "true";
              handleInputChange({ 
                target: { name: "isShown", value: val, type: "checkbox", checked: val } 
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            }}>
              <option value="true">საჯარო / Public</option>
              <option value="false">დამალული / Hidden</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="form-group">
            <label>მარაგი / Stock Quantity *</label>
            <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} onWheel={(e) => (e.target as HTMLInputElement).blur()} />
            {errors.stockQuantity && <span className="error-text">{errors.stockQuantity}</span>}
          </div>
          <div className="form-group">
            <label>უნიკალური / One of a Kind</label>
            <input type="checkbox" name="isOneOfAKind" checked={formData.isOneOfAKind} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>ტეგები და მასალები / Tags & Materials</h3>
        <div className="form-group row">
          <div className="form-group">
            <label>მასალები (GE)</label>
            <input type="text" value={tagInputs.materialsGe} onChange={(e) => handleTagInputChange("materialsGe", e.target.value)} />
            {errors.materialsGe && <span className="error-text">{errors.materialsGe}</span>}
          </div>
          <div className="form-group">
            <label>მასალები (EN)</label>
            <input type="text" value={tagInputs.materialsEn} onChange={(e) => handleTagInputChange("materialsEn", e.target.value)} />
            {errors.materialsEn && <span className="error-text">{errors.materialsEn}</span>}
          </div>
        </div>
        <div className="form-group row">
          <div className="form-group">
            <label>ტეგები (GE)</label>
            <input type="text" value={tagInputs.tagsGe} onChange={(e) => handleTagInputChange("tagsGe", e.target.value)} />
            {errors.tagsGe && <span className="error-text">{errors.tagsGe}</span>}
          </div>
          <div className="form-group">
            <label>ტეგები (EN)</label>
            <input type="text" value={tagInputs.tagsEn} onChange={(e) => handleTagInputChange("tagsEn", e.target.value)} />
            {errors.tagsEn && <span className="error-text">{errors.tagsEn}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        {onCancel && (
          <button type="button" className="cancel-btn" onClick={onCancel} disabled={loading}>
            გაუქმება / Cancel
          </button>
        )}
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "იშვება... / Saving..." : isEdit ? "განახლება / Update Product" : "დამატება / Add Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
