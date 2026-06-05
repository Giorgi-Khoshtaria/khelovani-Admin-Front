import api from "../api";

/**
 * Upload a single image to the shared Cloudinary "general" folder
 * (khelovani/general) and return its secure URL.
 *
 * Used for information-field assets like website / social icons. Files land in
 * the general folder so they also show up in the Media Manager.
 */
export const uploadImageRequest = async (
  file: File,
  folder = "general",
  onProgress?: (percent: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/api/admin/upload", formData, {
    params: { folder },
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  return response.data.data.url;
};
