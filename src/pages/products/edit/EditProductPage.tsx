import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProductDetailsRequest,
  updateProductRequest,
} from "@/apiCalls/partnerApiCalls/product.req";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductForm from "@/components/products/form/ProductForm";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import { getErrorMessage } from "@/utils/handleApiError";
import "./EditProductPage.scss";

export default function EditProductPage() {
  const { id: urlPartnerId, productId } = useParams<{
    id: string;
    productId: string;
  }>();
  const { token } = usePartnerContext();
  const decoded = parseJwt(token || "");
  const contextId = decoded?.id;
  const partnerId = urlPartnerId || contextId;
  const isAdmin = decoded?.role === "admin";

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const {
    formData,
    setFormData,
    setTagInputs,
    errors,
    handleInputChange,
    setArrayField,
    appendProcessedImage,
    resetImages,
    validate,
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
          stockQuantity:
            product.stockQuantity !== undefined
              ? product.stockQuantity.toString()
              : "",
          tagsGe: product.tagsGe || [],
          materialsGe: product.materialsGe || [],
          tagsEn: product.tagsEn || [],
          materialsEn: product.materialsEn || [],
          images: [],
          currency: product.currency || "GEL",
          isShown: product.isShown || false,
          shippingAvailable: product.shippingAvailable || false,
          shippingPrice:
            product.shippingPrice !== undefined
              ? product.shippingPrice.toString()
              : "",
          dimensions: product.dimensions || "",
          weight: product.weight !== undefined ? product.weight.toString() : "",
          isOnSale: product.isOnSale || false,
          discountPercent: product.discountPercent != null ? product.discountPercent.toString() : "",
          owner: product.owner || "",
        });
        setExistingImages(product.images || []);
        setTagInputs({
          tagsGe: (product.tagsGe || []).join(", "),
          tagsEn: (product.tagsEn || []).join(", "),
          materialsGe: (product.materialsGe || []).join(", "),
          materialsEn: (product.materialsEn || []).join(", "),
        });
      } catch (err) {
        toast.error(getErrorMessage(err, "შეცდომა პროდუქტის ჩატვირთვისას / Error loading product"));
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
      await updateProductRequest(partnerId, productId, submissionData, "ge", existingImages);
      toast.success(
        "პროდუქტი წარმატებით განახლდა / Product successfully updated",
      );
      navigate(
        urlPartnerId
          ? `/partners/${partnerId}/products/${productId}`
          : `/profile/products/${productId}`,
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "შეცდომა განახლებისას / Error updating product"));
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
        errors={errors}
        loading={loading}
        isEdit={true}
        existingImages={existingImages}
        onSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        setArrayField={setArrayField}
        appendProcessedImage={appendProcessedImage}
        resetImages={resetImages}
        removeExistingImage={(url) =>
          setExistingImages((prev) => prev.filter((u) => u !== url))
        }
        onCancel={() => navigate(-1)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
