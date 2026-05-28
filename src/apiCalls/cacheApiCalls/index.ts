import api from "../api";

export const clearCache = () => api.delete("/api/admin/cache");
