import type { Page } from "@/apiCalls/pageApiCalls/page.req";
import "./PageTable.scss";

interface PageTableProps {
  items: Page[];
  isLoading: boolean;
  onEdit: (item: Page) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export function PageTable({ items, isLoading, onEdit, onDelete, deletingId }: PageTableProps) {
  if (isLoading) {
    return <div className="loading">იტვირთება...</div>;
  }

  return (
    <div className="page-table-wrapper">
      <table className="page-table">
        <thead>
          <tr>
            <th>მისამართი</th>
            <th>სურათი</th>
            <th>სათაური (KA)</th>
            <th>აღწერა (KA)</th>
            <th>ინდექსაცია</th>
            <th>მოქმედება</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-row">
                გვერდები ცარიელია. დაამატეთ პირველი გვერდი.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                <td>
                  <code>{item.path}</code>
                </td>
                <td>
                  {item.ogImage ? (
                    <img className="og-thumb" src={item.ogImage} alt={item.title.ka} />
                  ) : (
                    <span className="og-thumb og-thumb--empty" />
                  )}
                </td>
                <td>{item.title.ka}</td>
                <td className="description-cell">{item.description.ka}</td>
                <td>
                  <span
                    className={`status-badge ${item.noindex ? "rejected" : "approved"}`}
                  >
                    {item.noindex ? "დამალული" : "ინდექსირებადი"}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="btn-primary-sm"
                    onClick={() => onEdit(item)}
                  >
                    რედაქტირება
                  </button>
                  <button
                    className="btn-danger-sm"
                    onClick={() => onDelete(item._id)}
                    disabled={deletingId === item._id}
                  >
                    {deletingId === item._id ? "..." : "წაშლა"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
