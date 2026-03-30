import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductDetailsRequest, updateProductRequest } from "@/apiCalls/partnerApiCalls/product.req";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductForm from "@/components/products/form/ProductForm";
import "./EditProductPage.scss";

export default function EditProductPage() {
  const { id: partnerId, productId } = useParams<{ id: string; productId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const {
    formData,
    setFormData,
    tagInputs,
    setTagInputs,
    errors,
    handleInputChange,
    handleTagInputChange,
    handleFileChange,
    validate
  } = useProductForm();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!partnerId || !productId) return;
      try {
        const product = await getProductDetailsRequest(partnerId, productId);
        setFormData({
          titleGe: product.titleGe || "",
          titleEn: product.titleEn || "",
          descriptionGe: product.descriptionGe || "",
          descriptionEn: product.descriptionEn || "",
          category: product.category || "",
          condition: product.condition || "handmade",
          price: product.price !== undefined ? product.price.toString() : "",
          stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity.toString() : "",
          tagsGe: product.tagsGe || [],
          materialsGe: product.materialsGe || [],
          tagsEn: product.tagsEn || [],
          materialsEn: product.materialsEn || [],
          images: [],
          currency: product.currency || "GEL",
          isShown: product.isShown || false,
          isOneOfAKind: product.isOneOfAKind || false,
          shippingAvailable: product.shippingAvailable || false,
          customizable: product.customizable || false,
          owner: product.owner || "",
        });
        setExistingImages(product.images || []);
        setTagInputs({
          tagsGe: (product.tagsGe || []).join(", "),
          tagsEn: (product.tagsEn || []).join(", "),
          materialsGe: (product.materialsGe || []).join(", "),
          materialsEn: (product.materialsEn || []).join(", "),
        });
      } catch {
        toast.error("შეცდომა პროდუქტის ჩატვირთვისას / Error loading product");
        navigate(-1);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [partnerId, productId, navigate, setFormData, setTagInputs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerId || !productId) return;

    const submissionData = validate(true, existingImages.length > 0);
    if (!submissionData) return;

    try {
      setLoading(true);
      await updateProductRequest(partnerId, productId, submissionData);
      toast.success("პროდუქტი წარმატებით განახლდა / Product successfully updated");
      navigate(`/partners/${partnerId}/products/${productId}`);
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? (error as unknown as { response?: { data?: { message?: string } } }).response?.data?.message || error.message 
        : "შეცდომა განახლებისას / Error updating product";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-overlay">იტვირთება...</div>;

  return (
    <div className="add-product-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← უკან
        </button>
        <h1>პროდუქტის რედაქტირება / Edit Product</h1>
      </div>

      <ProductForm
        formData={formData}
        tagInputs={tagInputs}
        errors={errors}
        loading={loading}
        isEdit={true}
        existingImages={existingImages}
        onSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleTagInputChange={handleTagInputChange as (name: "tagsGe" | "tagsEn" | "materialsGe" | "materialsEn", value: string) => void}
        handleFileChange={handleFileChange}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
