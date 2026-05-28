import api from "../api";
import type {
  MediaFilters,
  MediaItem,
  MediaListResponse,
  MediaOrganization,
} from "@/types/media.types";

/** Fetch a cursor-paginated, filtered page of media assets. */
export const getMediaRequest = async (
  filters: MediaFilters = {},
): Promise<MediaListResponse> => {
  const { orgId, search, dateFrom, dateTo, cursor, limit = 30 } = filters;

  const response = await api.get("/api/admin/media", {
    params: {
      ...(orgId && { orgId }),
      ...(search && { search }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(cursor && { cursor }),
      limit,
    },
  });

  return response.data.data;
};

/** Org list for the admin filter dropdown. */
export const getMediaOrganizationsRequest = async (): Promise<
  MediaOrganization[]
> => {
  const response = await api.get("/api/admin/media/organizations");
  return response.data.data;
};

/** Upload one or more images into an organisation folder. */
export const uploadMediaRequest = async (
  files: File[],
  orgId?: string,
  onProgress?: (percent: number) => void,
): Promise<MediaItem[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const response = await api.post("/api/admin/media", formData, {
    params: orgId ? { orgId } : undefined,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  return response.data.data.items;
};

/** Rename a media asset's file name. */
export const renameMediaRequest = async (
  publicId: string,
  newName: string,
): Promise<MediaItem> => {
  const response = await api.put("/api/admin/media/rename", {
    publicId,
    newName,
  });
  return response.data.data.item;
};

/** Delete one or more media assets. */
export const deleteMediaRequest = async (
  publicIds: string[],
): Promise<void> => {
  await api.delete("/api/admin/media", { data: { publicIds } });
};
