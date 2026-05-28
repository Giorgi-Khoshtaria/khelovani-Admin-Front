import type { LogSource, LogStatusFilter } from "@/types/logs.types";

export const STATUS_TABS: { value: LogStatusFilter; label: string }[] = [
  { value: "all", label: "ყველა" },
  { value: "error", label: "Errors" },
  { value: "ok", label: "OK" },
];

export const SOURCE_OPTIONS: { value: LogSource | "all"; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "user", label: "User" },
  { value: "partner", label: "Partner" },
  { value: "admin", label: "Admin" },
  { value: "public", label: "Public" },
];

export const METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

export const formatLogDate = (iso: string) => new Date(iso).toLocaleString();

export const statusClass = (code: number) => {
  if (code >= 500) return "status-badge status-500";
  if (code >= 400) return "status-badge status-400";
  if (code >= 300) return "status-badge status-300";
  return "status-badge status-200";
};
