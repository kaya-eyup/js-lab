export function escapeHtml(value: string | undefined | null): string {
  
  // & < > " ' karakterlerini HTML varlıklarına çevir
  if (!value) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
