/** Insert a Cloudinary transformation into an /upload/ delivery URL. */
export const cldTransform = (url: string, transform: string): string => {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/${transform}/`);
};

/** Square, auto-format/quality thumbnail for grid display. */
export const thumbUrl = (url: string, size = 320): string =>
  cldTransform(url, `c_fill,g_auto,w_${size},h_${size},q_auto,f_auto`);

/** Quality-optimised full preview for the lightbox. */
export const previewUrl = (url: string): string =>
  cldTransform(url, "c_limit,w_1600,h_1600,q_auto,f_auto");

/**
 * Cloudinary delivery URL that forces a file download (Content-Disposition:
 * attachment) with the given file name via the `fl_attachment` flag.
 */
export const downloadUrl = (url: string, fileName: string): string => {
  const safe = encodeURIComponent(fileName.replace(/[^\p{L}\p{N}_-]+/gu, "_"));
  return cldTransform(url, `fl_attachment:${safe}`);
};

/** Human-readable file size. */
export const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

/** Short, locale-aware date. */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
