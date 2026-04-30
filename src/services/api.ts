export { apiClient } from "@/lib/axios";

export function buildQueryString(params: any): string {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return query ? `?${query}` : "";
}