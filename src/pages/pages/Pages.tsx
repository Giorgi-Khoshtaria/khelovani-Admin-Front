import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getPagesRequest,
  deletePageRequest,
  type Page,
} from "@/apiCalls/pageApiCalls/page.req";
import { PageTable } from "@/components/pages/PageTable";
import { getErrorMessage } from "@/utils/handleApiError";
import "./Pages.scss";

function Pages() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getPagesRequest();
      setItems(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "გვერდების ჩატვირთვა ვერ მოხერხდა"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openEdit = (item: Page) => {
    navigate(`/pages/edit/${item._id}`, { state: { item } });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("ნამდვილად გსურთ წაშლა?")) return;
    setDeletingId(id);
    try {
      await deletePageRequest(id);
      toast.success("წაიშალა");
      fetchItems();
    } catch (err) {
      toast.error(getErrorMessage(err, "წაშლა ვერ მოხერხდა"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pages-page">
      <div className="page-header">
        <h1>გვერდები / SEO</h1>
        <button className="btn-primary" onClick={() => navigate("/pages/add")}>
          + გვერდის დამატება
        </button>
      </div>

      <PageTable
        items={items}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}

export default Pages;
