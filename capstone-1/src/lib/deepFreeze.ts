export function deepFreeze(value) {
    // ??? nesnenin kendisini ve içindeki her nesneyi dondur
    // gelen değer null falansa hiç dokunmadan kov.
    if (value === null || typeof value !== "object") {
    return value;
  }
    // 1. Nesnenin tüm anahtar isimlerini bir dizi olarak al ("route", "list" gibi)
    const propNames = Object.keys(value);

    for (const name of propNames) {
        const child = value[name]
    

    if (child !== null && typeof child === "object") { // null ile objectin meşhur referans kavgasını unutma
        deepFreeze(child) // kendini iş bitene kadar yeniden çağır
        }
        
    }
    // 4. İçerideki tüm alt dallar kilitlendikten sonra en dıştaki nesneyi de kilitle
  return Object.freeze(value);
}
    
