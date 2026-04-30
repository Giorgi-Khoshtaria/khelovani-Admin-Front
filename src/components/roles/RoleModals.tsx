const ALLOWED_PANELS = [
  { value: "admin", label: "Admin" },
  { value: "admin-organization", label: "Organization" },
];

interface RoleModalsProps {
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isPermModalOpen: boolean;
  setIsPermModalOpen: (open: boolean) => void;
  isPermEditModalOpen: boolean;
  setIsPermEditModalOpen: (open: boolean) => void;
  categories: string[];
  roleForm: {
    formData: { name: string; description: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
  roleAllowedPanels: string[];
  onRoleAllowedPanelsChange: (panel: string) => void;
  permForm: {
    formData: { name: string; description: string; category: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
  editPermForm: {
    formData: { name: string; description: string; category: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
  onCreateRole: (e: React.FormEvent) => void;
  onCreatePermission: (e: React.FormEvent) => void;
  onUpdatePermission: (e: React.FormEvent) => void;
}

export function RoleModals({
  isRoleModalOpen,
  setIsRoleModalOpen,
  isPermModalOpen,
  setIsPermModalOpen,
  isPermEditModalOpen,
  setIsPermEditModalOpen,
  categories,
  roleForm,
  roleAllowedPanels,
  onRoleAllowedPanelsChange,
  permForm,
  editPermForm,
  onCreateRole,
  onCreatePermission,
  onUpdatePermission,
}: RoleModalsProps) {
  return (
    <>
      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>ახალი როლი</h2>
            <form onSubmit={onCreateRole}>
              <div className="form-group">
                <label>სახელი *</label>
                <input
                  id="name"
                  type="text"
                  value={roleForm.formData.name}
                  onChange={roleForm.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>აღწერა</label>
                <textarea
                  id="description"
                  value={roleForm.formData.description}
                  onChange={roleForm.handleChange}
                />
              </div>
              <div className="form-group">
                <label>პანელები (Allowed Panels)</label>
                <div className="checkbox-group">
                  {ALLOWED_PANELS.map(({ value, label }) => (
                    <label key={value} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={roleAllowedPanels.includes(value)}
                        onChange={() => onRoleAllowedPanelsChange(value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary">
                  დამატება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {isPermModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>ახალი უფლება</h2>
            <form onSubmit={onCreatePermission}>
              <div className="form-group">
                <label>სახელი (მაგ. users:read) *</label>
                <input
                  id="name"
                  type="text"
                  value={permForm.formData.name}
                  onChange={permForm.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <input
                  id="description"
                  type="text"
                  value={permForm.formData.description}
                  onChange={permForm.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>კატეგორია *</label>
                <select
                  id="category"
                  value={permForm.formData.category}
                  onChange={permForm.handleChange}
                  required
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    <option value="General">General</option>
                  )}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPermModalOpen(false)}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary">
                  დამატება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Permission Modal */}
      {isPermEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>უფლების რედაქტირება</h2>
            <form onSubmit={onUpdatePermission}>
              <div className="form-group">
                <label>სახელი *</label>
                <input
                  id="name"
                  type="text"
                  value={editPermForm.formData.name}
                  onChange={editPermForm.handleChange}
                  required
                  disabled
                />
              </div>
              <div className="form-group">
                <label>აღწერა *</label>
                <input
                  id="description"
                  type="text"
                  value={editPermForm.formData.description}
                  onChange={editPermForm.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>კატეგორია *</label>
                <select
                  id="category"
                  value={editPermForm.formData.category}
                  onChange={editPermForm.handleChange}
                  required
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    <option value="General">General</option>
                  )}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsPermEditModalOpen(false)}
                >
                  გაუქმება
                </button>
                <button type="submit" className="btn-primary">
                  შენახვა
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
