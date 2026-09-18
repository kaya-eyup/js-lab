export function visibleItems(list) {
  if (list.status === "success") return list.data.items;
  if (list.status === "loading") return list.previous?.items ?? [];
  return [];
}

export function visibleTotal(list) {
  if (list.status === "success") return list.data.total;
  if (list.status === "loading") return list.previous?.total ?? 0;
  return 0;
}

export function statusText(list) {
  if (list.status === "idle") return "";
  if (list.status === "loading") return "Yükleniyor...";
  if (list.status === "error") return list.message;
  if (list.status === "success") {
    return list.data.items.length === 0
      ? "Sonuç bulunamadı."
      : `${list.data.total} sonuç listelendi`;
  }
  return "";
}