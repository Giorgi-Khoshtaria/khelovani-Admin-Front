import { useNavigate } from "react-router-dom";
import { useUserListing } from "@/hooks/users/useUserListing";
import "./UserListingPage.scss";
import type { User } from "@/types/user.types";
import { UserFilters } from "@/components/users/listing/UserFilters";
import { UserListHeader } from "@/components/users/listing/UserListHeader";
import { UserTableRow } from "@/components/users/listing/UserTableRow";

export default function UserListingPage() {
  const navigate = useNavigate();
  const {
    users,
    loading,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    selectedIds,
    allSelected,
    someSelected,
    toggleSelect,
    toggleSelectAll,
    handleDelete,
    handleBulkDelete,
    clearFilters,
  } = useUserListing();

  const onDelete = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    await handleDelete(userId);
  };

  const onRowClick = (user: User) => {
    navigate(`/users/${user._id}`);
  };

  return (
    <div className="user-listing-page">
      <div className="page-header">
        <div className="header-title">
          <h1>მომხმარებლები</h1>
          {totalCount > 0 && (
            <span className="count-badge">{totalCount}</span>
          )}
        </div>
      </div>

      <UserFilters
        search={search}
        onSearchChange={setSearch}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onClear={clearFilters}
      />

      {selectedIds.size > 0 && (
        <div className="bulk-toolbar" data-testid="bulk-toolbar">
          <span className="bulk-count">
            მონიშნული: {selectedIds.size}
          </span>
          <button
            className="bulk-delete-btn"
            onClick={handleBulkDelete}
            data-testid="bulk-delete-btn"
          >
            წაშლა ({selectedIds.size})
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading">იტვირთება...</div>
      ) : users.length === 0 ? (
        <div className="empty-state card">
          <p>მომხმარებლები ვერ მოიძებნა</p>
        </div>
      ) : (
        <div className="users-list card">
          <UserListHeader
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleAll={toggleSelectAll}
          />

          {users.map((user) => (
            <UserTableRow
              key={user._id}
              user={user}
              isSelected={selectedIds.has(user._id)}
              onToggleSelect={toggleSelect}
              onDelete={onDelete}
              onRowClick={() => onRowClick(user)}
            />
          ))}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p: number) => Math.max(1, p - 1))
                }
              >
                წინა
              </button>
              <span className="page-info">
                გვერდი {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p: number) => Math.min(totalPages, p + 1))
                }
              >
                შემდეგი
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
