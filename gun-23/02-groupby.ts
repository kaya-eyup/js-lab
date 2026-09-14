export   { };
    
// ── Bölüm 1 — önce JS: tipsiz çalışan sürüm ──────────────────
     const users = [
   { id: 1, name: "Ada", role: "admin" },
   { id: 2, name: "Ben", role: "user"  },
   { id: 3, name: "Cem", role: "admin" },
 ];


 const events = [
  { id: 1, at: new Date("2026-01-01"), kind: "login"  },
  { id: 2, at: new Date("2026-01-01"), kind: "logout" },
];
// function groupByPlain(items: any[], key: any): any {
//     const result = {}; // grupları toplayacağımız boş nesne

//   items.forEach(item => {
//     const groupKey = item[key];

//     // O grup (admin, user vb.) henüz açılmadıysa boş dizi başlat
//     if (!result[groupKey]) {
//       result[groupKey] = [];
//     }

//     // Elemanı o gruba push et
//     result[groupKey].push(item);
//   });

//   return result;
// } 
// // hata mesajı: Type 'T[K]' does not satisfy the constraint 'string | number | symbol'.

// console.log(groupByPlain(users, "role"));
// çıktı istendiği gibi.

// ── Bölüm 2 — tipi üç aşamada inşa et ────────────────────────
//     Aşama 1: naif deneme      → derleyici reddediyor
// function groupBy<T, K extends keyof T>(items: readonly T[], key: K): Record<T[K], T[]> {
  
// } // çıktı istendiği gibi

//     Aşama 2: anahtar kısıtı   → derleniyor

    type GroupedNaive<T, K extends keyof T> = Record<Extract<T[K], PropertyKey>, T[]>;

function groupBy<T, K extends keyof T>(items: readonly T[], key: K): GroupedNaive<T, K> {
  const result = {} as GroupedNaive<T, K>; // Yalan 1: Boş nesne, içi dolu bir Record gibi gösteriliyor.
  for (const item of items) {
    const k = item[key] as Extract<T[K], PropertyKey>; // Yalan 2: T[K]'nın hep PropertyKey olacağını varsayıyoruz.
    (result[k] ??= []).push(item);
  }
  return result;
}

const byRole = groupBy(users, "role");
console.log(byRole.admin.length); // 2
    
    
//     Aşama 3: dürüst dönüş tipi → yalanı kaldır

// Deney 1'in faciasını engellemek için Partial ile sarmalıyoruz.

type GroupedHonest<T, K extends keyof T> = Partial<Record<Extract<T[K], PropertyKey>, T[]>>;

function groupByHonest<T, K extends keyof T>(items: readonly T[], key: K): GroupedHonest<T, K> {
  const result: GroupedHonest<T, K> = {}; // 'as' kullanmadık! Çünkü boş obje ({}) Partial bir tipe zaten uyar. Yalan bitti.
  for (const item of items) {
    const k = item[key] as Extract<T[K], PropertyKey>;
    (result[k] ??= []).push(item);
  }
  return result;
}

const byRoleHonest = groupByHonest(users, "role");
// @ts-expect-error Object is possibly 'undefined'.
 byRoleHonest.admin.length; 
const adminCount = byRoleHonest.admin?.length; // Doğrusu bu.

// Takasın özeti: Her erişimde '?.' yazmak zordur (maliyet) ama runtime'da undefined.length yüzünden uygulamanın çökmesinden çok daha iyidir. TS'te yerleşik olan Object.groupBy da Partial sarmallıdır.    
// ── Bölüm 3 — iki deney ──────────────────────────────────────
    // Deney 1: Var olmayan kova
// Tahmin: 'manager' rolü users dizisinde yok. 'byRole.manager' derleme anında hata vermez çünkü Record dönüş tipi manager'ın var olduğunu garanti eder (Yalan 1'in sonucu). Çalışma anında (runtime) patlar (undefined.length).

console.log(byRole.admin.length); // 2
console.log(byRole.manager.length); // Derlenir (hata yok), ama RUNTIME'DA ÇÖKER: TypeError: Cannot read properties of undefined (reading 'length')

// Özeti: Record<K, T[]> iddia eder ki K'daki her ihtimal objede kesinlikle var ve içinde dizi var. Gerçekte (runtime) ise sadece dizide olan roller var, geri kalanı undefined.

// Deney 2: Anahtar olamayacak bir alan
// Tahmin: 'events' içindeki 'at' alanı bir Date objesi. 
const byDate = groupBy(events, "at");
// Derlenir mi?: EVET derlenir. Çünkü 'at' geçerli bir key.
// Dönüş Tipi: GroupedNaive<typeof events[0], "at"> yani Record<never, {id: number, at: Date, kind: string}[]>. 'Date' PropertyKey'e uymaz, Extract işlemi onu 'never'a çevirir. Tipi kullanılamaz (never) hale getirdi.
// Runtime Çıktısı: { "Thu Jan 01 2026 ...": [ ... ] }. JS sessizce Date nesnesini string'e (toString) çevirip anahtar yaptı, ama TS ipin ucunu kaçırdı.

    
// ── Bölüm 4 — ikinci tasarım: anahtar seçici fonksiyon ───────
    
    // Anahtar adını string ("role") olarak vermek yerine (design flaw), değeri bir arrow function (selector) ile alırız.

function groupByKey<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => K
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const k = getKey(item);
    (result[k] ??= []).push(item);
  }
  return result;
}

// Deneyler:
const a = groupByKey(users, u => u.role); // Geçerli. Tip: Partial<Record<"admin"|"user", User[]>>
 // @ts-expect-error Type 'Date' is not assignable to type 'PropertyKey'. (Date'in anahtar olma deliği doğrudan kapatıldı).
 const b = groupByKey(events, e => e.at); 
const c = groupByKey(users, u => u.name[0]); // Geçerli. İsimlerin baş harfine göre dinamik gruplama.


    
    
// ── Bölüm 5 — aşırı yükleme (overload), okuma notu ───────────


// Bazı fonksiyonlar girdiye göre tamamen farklı şeyler döndürür. document.createElement("img") bir HTMLImageElement verir, document.createElement("a") bir HTMLAnchorElement. Tek bir dönüş tipi yazamazsın; HTMLElement yazarsan her çağrıda as gerekir.

// Çözüm: aynı fonksiyona birden fazla imza yazmak. Gövde tek, imzalar çok:
function parse(input: string): string[];
function parse(input: number): number[];
function parse(input: string | number): unknown[] {   // ← gövdenin imzası, dışarıdan görünmez
  return [input];
}

const x = parse("x");   // string[]
const y = parse(3);     // number[]

// Üç şeyi bil, yeter:

// Modern TS'te çoğu durumda gereksizdir. Girdiyle çıktı arasındaki ilişki düzenliyse generics daha temizdir ve iki yerde bakım gerektirmez. Bugünkü groupBy generic ile çözüldü, overload'a hiç ihtiyaç olmadı.
// Gövdenin imzası dışarıya kapalıdır. Yukarıdaki string | number sürümü çağrılamaz. Yani gövde imzası bir sözleşme değil, bir iç detaydır.
// Doğru yeri: girdi-çıktı ilişkisi düzenli olmayan, ayrık durumlar. createElement gibi. Bir de eski JS kütüphanelerine tip yazarken — "iki argümanla da, üç argümanla da çağrılabilir" gibi durumlarda.


/* 
Mimari Karşılaştırma Özeti:
| Özellik | alan adı ("role") | anahtar seçici (u => u.role) |
| :--- | :--- | :--- |
| Anahtar olamayan alan | Sessizce geçer (never'a düşer) | Derleme anında anında yakalanır |
| Hesaplanmış anahtar | İmkansız | Doğal (isim baş harfi vb.) |
| Standart Kütüphane Seçimi | ❌ | ✅ (Object.groupBy böyle çalışır) |
*/


//groupBy'ın çıktı tipinin kalitesi, tamamen girdi tipinin kalitesine bağlıdır. Fonksiyon iyileşmedi; kaynak tip iyileşti.