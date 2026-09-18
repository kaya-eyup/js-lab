
export function deepFreeze<T>(value: T): T {
    // ??? nesnenin kendisini ve içindeki her nesneyi dondur
    // gelen değer null falansa hiç dokunmadan kov.
    if (value === null || typeof value !== "object") {
    return value;
  }
  // 1. Nesnenin tüm anahtar isimlerini bir dizi olarak al ("route", "list" gibi)
    // Kapıda durdurup unknown[] yaparak any sızıntısını kapatıyoruz:
    const children: unknown[]  = Object.values(value); // unknown kontrolünden önce any.

    for (const child of children) {
    
    if (child !== null && typeof child === "object") { // null ile objectin meşhur referans kavgasını unutma
        deepFreeze(child) // kendini iş bitene kadar yeniden çağır
        }
        
    }
    // 4. İçerideki tüm alt dallar kilitlendikten sonra en dıştaki nesneyi de kilitle
  return Object.freeze(value);
}
    
