export interface MediaItem {
  publicId: string;
  url: string;
  name: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  folder: string;
  orgId: string | null;
  createdAt: string;
}

export interface MediaListResponse {
  items: MediaItem[];
  nextCursor: string | null;
  totalCount: number;
}

export interface MediaOrganization {
  id: string;
  name: string;
}

export interface MediaFolder {
  name: string;
  path: string;
}

export interface MediaFilters {
  orgId?: string;
  folder?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  cursor?: string;
  limit?: number;
}
