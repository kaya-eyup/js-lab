# Gün 23 — Utility types + eşlemeli tipler (mapped types)

`00-my-utilities.ts` + `01-derive.ts` konsolidasyonu · 14 Eylül 2026

---

## 0. Bir cümlede

Tipler kopyalanmaz, **türetilir**. Türetmenin motoru eşlemeli tiptir (mapped type); TypeScript'in hazır utility type'larının yarısı bu motorun bir satırlık kullanımlarıdır, diğer yarısı (koşullu tip gerektirenler) Gün 27'ye kadar kara kutudur.

---

## 1. Çözülen sorun

Bir tipi elle kopyalayıp üstünde değişiklik yapmak (`User` → elle yazılmış `UserDraft`) **bakım borcudur**. Kaynak tip değişince kopya sessizce ayrışır ve derleyici bunu haber vermez, çünkü her iki tip de kendi başına geçerlidir.

İstenen cümle şudur: *"B tipi, A tipinin aynısı ama şu farkla."* Bu cümleyi koda çeviren araç eşlemeli tiptir.

---

## 2. Fikir: `.map()`'in tip seviyesindeki karşılığı

```ts
const withTax = prices.map(p => p * 1.2);   // değer seviyesi
type   Draft  = { [P in keyof User]?: User[P] };  // tip seviyesi
```

İkisi de aynı şeyi söyler: "kaynağı gez, her elemanı dönüştür, yeni bir şey kur." Kaynak değişirse sonuç kendiliğinden değişir.

**"Tipler de bir programlama dili" cümlesinin ilk somut kanıtı budur:** tip seviyesinde bir döngün var.

---

## 3. İskeletin anatomisi

```ts
type Copy<T> = { [P in keyof T]: T[P] };
```

| Parça | Adı | Ne yapıyor |
|---|---|---|
| `T` | tip parametresi | kaynak tip |
| `keyof T` | anahtar operatörü | gezilecek anahtarların birleşimi (`"id" \| "name" \| ...`) |
| `P` | eşleme değişkeni | döngü değişkeni; adını sen seçersin (`.map(p => ...)`'daki `p`) |
| `T[P]` | indeksli erişim (indexed access) | o anahtarın kaynaktaki tipi |

`Copy<T>` tek başına işe yaramaz — ama bugün yazılan her şey bu satırın üstüne **bir işaret** eklemekten ibarettir.

---

## 4. Değiştiriciler (modifiers)

| Yazılan | Anlamı | TS'teki hazır karşılığı |
|---|---|---|
| `{ [P in keyof T]?: T[P] }` | her alan isteğe bağlı | `Partial<T>` |
| `{ [P in keyof T]-?: T[P] }` | isteğe bağlılığı **kaldır** | `Required<T>` |
| `{ readonly [P in keyof T]: T[P] }` | her alan salt-okunur | `Readonly<T>` |
| `{ -readonly [P in keyof T]: T[P] }` | salt-okunurluğu **kaldır** | **yok — kendin yazarsın** (`Mutable<T>`) |

`-?` ve `-readonly` → **kaldırma değiştiricileri (removing modifiers)**.
`+?` / `+readonly` da geçerlidir ama `+` varsayılan olduğu için yazılmaz.

`Mutable`'ın lib'de bulunmaması bir eksiklik değil, bir duruş: değişmezlik (immutability) varsayılan tercih sayılır, onu sökmek istisnadır.

---

## 5. Anahtar listesini değiştirmek: `Pick` ve `Record`

```ts
type MyPick<T, K extends keyof T>     = { [P in K]: T[P] };   // Pick<T, K>
type MyRecord<K extends keyof any, V> = { [P in K]: V };      // Record<K, V>
```

`keyof any` = `string | number | symbol` → "anahtar olabilecek herhangi bir şey".

| | `Pick` | `Record` |
|---|---|---|
| Anahtarlar nereden | mevcut tipten süzülür (`keyof T`) | doğrudan dışarıdan verilir |
| Değer tipi | her anahtar için farklı (`T[P]`) | hepsi için aynı (`V`) |
| İşi | var olan tipi **daraltmak** | sıfırdan **sözlük kurmak** |
| Kaynak tip gerekir mi | evet | hayır |

**Deney 3'ün bulgusu:** biri diğerinin yerine geçmiyor.
- `Record`'a `Pick`'in işini yaptırmaya çalışmak → değer tipini `number | string` yapmak zorunda kalırsın, tip güvenliği çöker (`{ id: "abc" }` geçer).
- `Pick`'e `Record`'un işini yaptırmaya çalışmak → kaynak olarak **zaten üretmek istediğin sözlüğü** elle yazmak zorunda kalırsın. Döngüsel.

Ayrımı anahtarlarda değil **değer tarafında** ara:

```ts
type A1 = Record<keyof User, string>;  // { id: string;  name: string; ... }  ← V sabit
type A2 = Pick<User, keyof User>;      // { id: number;  name: string; ... }  ← T[P] korunuyor
```

---

## 6. Kısıtın ikinci işlevi

`MyPick<T, K extends keyof T>`'deki kısıt iki iş birden yapar:

1. **Hatalı anahtarı engeller** — `Pick<User, "phone">` derleme anında patlar.
2. **Derleyiciye kaynağı bildirir** — "bu eşlemenin kaynağı `T`'dir" bilgisi buradan gelir, ve değiştirici koruması (bkz. §7) bu sayede çalışır.

İkinci maddenin doğrudan kanıtı `Omit`'tir: kısıtı `keyof any` olduğu için hiçbirini yapamaz.

---

## 7. Eş-yapılı eşleme (homomorphic mapped type) — iki ayrı kural

Derleyici, bir eşlemenin kaynağın işaretlerini miras alıp almayacağına iki yoldan karar verir:

- Döngü doğrudan `keyof T` üzerindeyse → `Partial`, `Readonly`, `Required`
- Döngü bir `K` üzerindeyse **ve `K extends keyof T` ise** → `Pick`

Her iki durumda da `readonly` ve `?` **korunur**. Ama:

| | `[P in keyof T]` | `[P in K extends keyof T]` |
|---|---|---|
| `readonly` / `?` korunur mu | ✅ | ✅ |
| Dizi, dizi kalır mı | ✅ | ❌ |

```ts
type S1 = Partial<string[]>;        // (string | undefined)[]   → dizi
type S2 = Pick<string[], number>;   // { [x: number]: string }  → dizi değil
```

> Bu iki kuralı ilk anlatımda tek kural sanıp yanlış anlatmıştım; `MyPick<WithFlags, "id">` deneyi düzeltti. Hover takma adı gösterdiği için **ölçüm yöntemi değer atamaktır**, hover değil.

---

## 8. `Partial`'ın üç tuzağı

**8.1 — Yüzeysel (shallow).** Sadece bir seviye iner.

```ts
type Config = { db: { host: string; port: number }; debug: boolean };
const c: Partial<Config> = { db: { host: "localhost" } };  // ❌ port eksik
```

Eşleme yalnızca **en üst seviyedeki anahtar listesini** gezer; değer tipi `T[P]` olduğu gibi alınır, içine girilmez. Spread (`...`) ile birebir aynı mantık.

`DeepPartial` kendi kendini çağıran bir tip gerektirir → koşullu tip → Gün 27.
**Senior notu:** `DeepPartial` çoğu zaman kod kokusudur; her seviyesi eksik olabilen bir yapılandırma `config?.db?.host` zincirlerine dönüşür. Olgun yol: varsayılanları tek yerde birleştirip aşağıya **tam** tipi geçirmek.

**8.2 — Bulaşıcı.** Bir fonksiyonun girdisini `Partial<T>` yapmak, derleyicinin "bu alanı unuttun" uyarısını kendi elinle kapatmaktır.

| Doğru yer | Yanlış yer |
|---|---|
| Güncelleme/yama yükü: `updateUser(id, patch: Partial<User>)` — eksiklik meşrudur | Nesnenin **oluşturulduğu** yer: `createUser(data: Partial<User>)` — e-postasız kullanıcıyı çalışma anında öğrenirsin |

Form taslağı için doğrusu da çoğu zaman `Partial<User>` değil, ayrı bir `UserFormValues` tipidir — çünkü formda `port` alanı `number` değil, kullanıcının yazdığı **metindir**.

**8.3 — Dizilerde neredeyse her zaman hata.**

```ts
const arr: Partial<string[]> = ["a"];
arr[0].toUpperCase();   // ❌ 'arr[0]' possibly 'undefined'
```

"Dizinin bazı elemanları eksik olabilir" demek istemezsin. Dizinin *kendisi* isteğe bağlıysa yazılışı `items?: string[]`'tir.

---

## 9. Bileşim: `PartialBy` ve `Prettify`

```ts
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

"Sadece belirttiğim alanlar isteğe bağlı olsun, gerisi zorunlu kalsın." Tipi iki parçaya ayırıp `&` ile birleştirmek — tek eşlemeyle çıkmaz.

Kesişimin bedeli **okunabilirliktir**: hover `Omit<User,"email"> & Partial<Pick<User,"email">>` gösterir, `{ id: number; name: string; email?: string }` değil. Hata mesajları duvara döner.

```ts
type Prettify<T> = { [P in keyof T]: T[P] } & {};
```

Bir tipi baştan sona gezip yeniden kurmak, derleyiciyi onu düz bir nesne olarak yeniden yazmaya zorlar. Sektörde `Prettify` / `Simplify` / `Flatten` adlarıyla hemen her orta ölçekli TS projesinin `types/utils.ts`'inde bulunur.

> `& {}` neden gerekli → `park.md`. İpucu: `NonNullable<T>` da TS 4.8'den beri `T & {}` diye tanımlı; yani `{}` "null ve undefined dışında herhangi bir şey" demek.

---

## 10. Türetme mimarisi (`01-derive.ts`)

Tek doğruluk kaynağı bir tane:

```ts
type User = { id; name; email; passwordHash; createdAt; role };
```

Geri kalan her tip ondan türer, **hiçbirinde alan adı elle tekrar yazılmaz**:

| Tip | Ne için | Nasıl |
|---|---|---|
| `PublicUser` | istemciye giden | beyaz liste |
| `UserListItem` | liste satırı | `Pick<User, "id" \| "name">` |
| `NewUser` | oluşturma yükü | beyaz liste + `& { password: string }` |
| `UserPatch` | güncelleme yükü | `Partial<Pick<User, "name" \| "email">>` |

`UserPatch`'te `Partial<User>` **yazılmaz** — §8.2.

---

## 11. Günün en önemli bulgusu: beyaz liste / kara liste

- **`Omit` = kara liste (denylist).** "Şunları çıkar, gerisi girsin." Kaynağa eklenen yeni alan **varsayılan olarak içeridedir**.
- **`Pick` = beyaz liste (allowlist).** "Sadece şunlar girsin." Yeni alan **varsayılan olarak dışarıdadır**.

**Deney 1'in gerçek sonucu:** `User`'a `role` eklendiği an, `Omit` ile türetilmiş `NewUser` `role`'ü içine aldı — yani istemci kayıt olurken kendi rolünü gönderebilir hâle geldi. Tek yapılan kaynağa bir alan eklemekti. Adı olan bir güvenlik açığı: **toplu atama (mass assignment / over-posting)**, ayrıcalık yükseltme hatalarının klasik doğuş biçimi.

Aynı asimetri ters yönde de geçerli: `Omit` ile yazılmış `PublicUser`, `User`'a eklenen `twoFactorSecret`'ı sessizce dışarı verir.

**Kural:** güven sınırını geçen tiplerde (istemciden gelen + istemciye giden) **beyaz liste**. `Omit`'in yeri iç katmanlardır.

**Takas gerçektir:** kara liste bakım kolaylığı verir (yeni alan otomatik akar), beyaz liste güvenlik verir (her alan bilinçli kararla açılır). Sınırda güvenlik kazanır, çünkü unutmanın bedeli asimetriktir — fazladan alan sızdırmak, eksik alan göstermekten çok daha pahalıdır.

---

## 12. `Omit`'in kör noktası

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type Oops = Omit<User, "passwordHashh">;   // tek harf hata → hiçbir şey çıkarılmadı
// Oops === User  (passwordHash dahil)
```

Kısıt `keyof T` değil `keyof any` olduğu için yazım hatası **sessizce** geçer. Kendi kısıtlı sürümünü yaz:

```ts
type StrictOmit<T, K extends keyof T> = Omit<T, K>;
```

Sonuç: sınırda `Pick`, iç katmanda `StrictOmit`, çıplak `Omit` hiçbir yerde.

---

## 13. Fonksiyondan tip okumak

Bir fonksiyonun ne aldığı ve ne döndürdüğü zaten imzasında yazılıdır; ikinci kez elle yazmak aynı bakım borcudur.

```ts
async function fetchUser(id: number): Promise<PublicUser | null> { ... }

type P1 = Parameters<typeof fetchUser>;  // [id: number]           ← etiketli demet
type P2 = ReturnType<typeof fetchUser>;  // Promise<PublicUser | null>
type P3 = Awaited<P2>;                   // PublicUser | null
type P4 = NonNullable<P3>;               // PublicUser
type ID = Parameters<typeof fetchUser>[0];  // number
```

- `typeof fetchUser` neden gerekli: `fetchUser` bir **değer**, `Parameters<>` bir **tip** bekler; `typeof` köprüyü kurar.
- `Parameters` bir demet döndürür (sıralı küme) → indekslenebilir. Bu, dünkü `T[K]`'nın demet üzerindeki hâlidir.
- `async` fonksiyon `PublicUser` değil `Promise<PublicUser>` döndürür — `ReturnType` bunu olduğu gibi verir.
- `Awaited` özyinelemelidir, iç içe sözleri sonuna kadar açar (TS 4.5+; öncesinde elle yazılan sürümler iç içe durumda kırılıyordu).
- `NonNullable` hem `null` hem `undefined` atar.

---

## 14. Bugün ne yazabildin, ne kara kutu kaldı

| Kendin yazdıkların (eşlemeli tip) | Kara kutu olarak kullandıkların |
|---|---|
| `Partial`, `Required`, `Readonly`, `Mutable`, `Pick`, `Record`, `Prettify`, `PartialBy`, `StrictOmit` | `Omit`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited` |

Sağ sütunun ortak özelliği: hepsi bir **soru** içerir — *"bu tip şuna uyuyorsa şunu ver, uymuyorsa bunu."* Bunun adı **koşullu tip (conditional type)** ve **Gün 27**'ye tarihli. `Omit`'in tanımındaki `Exclude` de oraya ait.

---

## 15. Çıkarım mekanizması (Bölüm 0 düzeltmesi)

```ts
declare function pair<T>(a: T, b: T): T[];
declare function all<T>(items: T[]): T;

pair(1, 2);         // T = number
pair(1, "iki");     // ❌ hata — birleşim uydurulmaz
all([1, "iki"]);    // T = string | number
```

1. **Aday toplama** — TS ilk argümana kilitlenmez; tüm argümanları tarayıp aday havuzu çıkarır.
2. **Seçim** — seçilen tip havuzdaki adaylardan **biri** olmak zorundadır; diğer bütün adayların kendisine atanabildiği aday hangisiyse o seçilir.
3. **Birleşim icat edilmez** — bağımsız parametreler çakıştığında TS durumu kurtarmak için `number | string` uydurmaz.
4. **"İlkine kilitlendi" yanılsaması** — uyuşma bulunamayınca derleyici geri düşüş olarak ilk adayı seçip devam eder ve hatayı ikinci argümanda raporlar. Yanılsamanın kaynağı bu.

`all([1, "iki"])`'de birleşim **çıkarımdan önce** doğar: `[1, "iki"]` değişmezi kendi başına `(string | number)[]` olarak tiplenir, sonra `T[]` ile eşleştirilir. Birleşimi yapan dizi değişmezidir, çıkarım algoritması değil.

---

## 16. Taşınabilir refleksler

1. Aynı alan adını iki tipte yazıyorsan dur — türetilebilir mi diye sor.
2. Güven sınırında `Pick`, iç katmanda `StrictOmit`.
3. `Partial`ı yamada kullan, oluşturmada kullanma.
4. Kesişim yazdıysan `Prettify` ile sar.
5. Tipin doğruluğunu **hover'a bakarak değil, değer atayarak** ölç.
6. `@ts-expect-error` yorumuna tahmin değil, **gerçek derleyici çıktısı** yazılır.
