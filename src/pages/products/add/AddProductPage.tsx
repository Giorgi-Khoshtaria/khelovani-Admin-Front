import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addProductRequest } from "@/apiCalls/partnerApiCalls/product.req";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductForm from "@/components/products/form/ProductForm";
import { usePartnerContext } from "@/context/PartnerContext";
import { parseJwt } from "@/utils/parseJwt";
import "./AddProductPage.scss";

export default function AddProductPage() {
  const { id: urlId } = useParams<{ id: string }>();
  const { partnerId: contextId, token } = usePartnerContext();
  const id = urlId || contextId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const decoded = parseJwt(token || "");
  const role = (decoded?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "super_admin";

  const {
    formData,
    tagInputs,
    errors,
    handleInputChange,
    handleTagInputChange,
    handleFileChange,
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
      const message =
        error instanceof Error
          ? (error as unknown as { response?: { data?: { message?: string } } })
              .response?.data?.message || error.message
          : "შეცდომა დამატებისას / Error adding product";
      toast.error(message);
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
        <h1>ახალი პროდუქტის დამატება / Add New Product</h1>
      </div>

      <ProductForm
        formData={formData}
        tagInputs={tagInputs}
        errors={errors}
        loading={loading}
        onSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleTagInputChange={
          handleTagInputChange as (
            name: "tagsGe" | "tagsEn" | "materialsGe" | "materialsEn",
            value: string,
          ) => void
        }
        handleFileChange={handleFileChange}
        onCancel={() => navigate(-1)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
