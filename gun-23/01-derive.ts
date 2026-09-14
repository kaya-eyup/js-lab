export { };
    
    
// ── Bölüm 1 — tek kaynak ve ondan türeyenler ─────────────────
//   User            (tek doğruluk kaynağı)
    
    type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
        // deney 1 için geçici ekleme
  role: "admin" | "user";
}

//   PublicUser      (dışarı verilen)
// Sunucunun dışarı verdiği güvenli veri (Omit ile şifreyi at)
type PublicUser = Omit<User, "passwordHash">;
// @ts-expect-error : Object literal may only specify known properties, and 'passwordHash' does not exist in type 'PublicUser'.
const p: PublicUser = { id:1, name:"a", email:"b", createdAt:new Date(), passwordHash:"x" }

//   UserListItem      (liste ekranı)
// Liste ekranı için minimal veri (Pick ile cımbızla)
type UserListItem = Pick<User, "id" | "name">;


//   NewUser         (oluşturma yükü)

// Sunucu id ve createdAt'i kendisi üretir. Kullanıcıdan şifreyi düz metin alırız.
type Prettify<T> = { [K in keyof T]: T[K] } & {}; // Kesişimi okunabilir hale getiren sihirli tip
//type NewUser = Prettify<Omit<User, "id" | "createdAt" | "passwordHash"> & { password: string }>;
//omit ile yazılan üstteki blokta büyük bir tehlike var. kullanıcı kendi rolünü seçebiliyor.
// tedavisi sadece istenen alanları seçerek yeni eklenenlerin sızıntısından kurtulmaktır, yani "Pick"
type NewUser = Prettify<Pick<User, "name" | "email"> & { password: string }>;



//   UserPatch       (güncelleme yükü)
// pick ile seçilen elemanlara "?" eklemeli.
type UserPatch = Partial<Pick<User, "name" | "email">>;

// ── Bölüm 2 — fonksiyondan tip okumak ────────────────────────

// bir fonksiyon yazdığında ne aldığı ve ne döndürdüğü zaten imzasında yazılıdır. Bunu ikinci kez elle yazmak, UserDraft'ı elle yazmakla aynı bakım borcudur. Fonksiyona sorman yeterli.

async function fetchUser(id: number): Promise<PublicUser | null> {
  return null;
};


type P1 = Parameters<typeof fetchUser>; // parametreleri verir, etiketli demet olarak. zira fonksiyonun parametre listesi sıralı bi kümedir.
type P2 = ReturnType<typeof fetchUser>; // dönüş tipi, Promise verir
type P3 = Awaited<P2>;  // promise içinde beklenen değerleri verir
type P4 = NonNullable<P3>; // null olamayacak değerler anlamına geliyor. PublicUser'in tamamı yani.

// ── Bölüm 3 — iki deney ──────────────────────────────────────

//   Deney 1: kaynağa alan eklersen ne oluyor
// PublicUser değişmeli, UserList değişmez, NewUser değişir, UserPatch değişmez. 
// NewUser değişmemesi gerekirken değişti, yeni kaydolan User kendi rolünü admin yapabilir. tehlikeli bir açık.

//   Deney 2: Omit'e yanlış anahtar verirsen ne oluyor

type Oops = Omit<User, "passwordHashh">;   // ← bilerek yanlış yazılmış anahtar
// hata vermemeli zira adı yanlış yazdık. burda hatalık bi durum yok, keylerin arasında olmayan keyi atamaz . anahtar parametresi Pick'te olduğu gibi kısıtlı değil zira.

type StrictOmit<T, K extends keyof T> = Omit<T, K>;

// @ts-expect-error : Type '"passwordHashh"' does not satisfy the constraint 'keyof User'. 
type Oops2 = StrictOmit<User, "passwordHashh">; // hedef keylerin arasında böyle bi key yok diye hata verecek çünkü doğru keyler ile kısıtladık hedef bölgeyi.