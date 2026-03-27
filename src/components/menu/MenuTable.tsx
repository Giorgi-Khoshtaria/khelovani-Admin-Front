import type { MenuItem } from "@/apiCalls/menuApiCalls/menu.req";
import "./MenuTable.scss";

interface MenuTableProps {
  items: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export function MenuTable({ items, isLoading, onEdit, onDelete, deletingId }: MenuTableProps) {
  if (isLoading) {
    return <div className="loading">იტვირთება...</div>;
  }

  return (
    <div className="menu-table-wrapper">
      <table className="menu-table">
        <thead>
          <tr>
            <th>#</th>
            <th>სახელი (KA)</th>
            <th>სახელი (EN)</th>
            <th>ლინკი (href)</th>
            <th>სტატუსი</th>
            <th>მოქმედება</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="empty-row">
                მენიუ ცარიელია. დაამატეთ პირველი ელემენტი.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id}>
                <td>{item.order}</td>
                <td>{item.label.ka}</td>
                <td>{item.label.en}</td>
                <td>
                  <code>{item.href}</code>
                </td>
                <td>
                  <span
                    className={`status-badge ${item.isActive ? "approved" : "rejected"}`}
                  >
                    {item.isActive ? "აქტიური" : "გამორთული"}
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
