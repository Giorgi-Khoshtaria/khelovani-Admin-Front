import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addProductRequest } from "@/apiCalls/partnerApiCalls/product.req";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductForm from "@/components/products/form/ProductForm";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import { getErrorMessage } from "@/utils/handleApiError";
import "./AddProductPage.scss";

export default function AddProductPage() {
  const { id: urlId } = useParams<{ id: string }>();
  const { token } = usePartnerContext();
  const decoded = parseJwt(token || "");
  const contextId = decoded?.id;
  const id = urlId || contextId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isAdmin = decoded?.role === "admin" || decoded?.role === "super_admin";

  const {
    formData,
    errors,
    handleInputChange,
    setArrayField,
    appendProcessedImage,
    resetImages,
    validate,
  } = useProductForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const submissionData = validate(false, false);
    if (!submissionData) return;

    try {
      setLoading(true);
      await addProductRequest(id, submissionData);
      toast.success("პროდუქტი წარმატებით დაემატა / Product successfully added");
      navigate(urlId ? `/partners/${id}/products` : "/profile/products");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "შეცდომა დამატებისას / Error adding product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← უკან
        </button>
        <div className="header-text">
          <h1>ახალი პროდუქტის დამატება</h1>
          <p>შეავსეთ ყველა სავალდებულო ველი პროდუქტის გამოსაქვეყნებლად</p>
        </div>
      </div>

      <ProductForm
        formData={formData}
        errors={errors}
        loading={loading}
        onSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        setArrayField={setArrayField}
        appendProcessedImage={appendProcessedImage}
        resetImages={resetImages}
        onCancel={() => navigate(-1)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
