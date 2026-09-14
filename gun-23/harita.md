# TypeScript Eşlemeli Tipler (Mapped Types) - Kavram Haritası

## 1. Ana Fikir ve Motivasyon
* Tipleri elle kopyalayıp yapıştırmak (örn. `User` -> `UserDraft`) **bakım borcu** (maintenance debt) yaratır. Kaynak tip değiştiğinde kopyalar sessizce eskir.
* **Çözüm:** Değer seviyesindeki `Array.map` mantığını tiplere taşımak. Bir tipten dinamik olarak başka bir tip türetmek.

## 2. Eşlemeli Tip İskeleti
Tip seviyesinde bir döngü kurmanın en temel formülü:
`type Copy<T> = { [P in keyof T]: T[P] };`

* **`T`**: Kaynak tip.
* **`keyof T`**: Anahtar listesi (döngünün döneceği alanlar).
* **`P`**: Eşleme değişkeni (döngüdeki o anki anahtar, `map(p => ...)` içindeki `p` gibi).
* **`T[P]`**: İndeksli erişim (o anahtarın orijinal tipi).

## 3. Değiştiriciler (Modifiers) ve Yerleşik Tipler
Döngü çıktısına işaretler ekleyerek veya çıkararak yeni tipler üretilir:

* **İsteğe Bağlı Yapma (`?`):** 
  `type MyPartial<T> = { [P in keyof T]?: T[P] };` -> `Partial<T>`
* **Salt-Okunur Yapma (`readonly`):** 
  `type MyReadonly<T> = { readonly [P in keyof T]: T[P] };` -> `Readonly<T>`
* **İsteğe Bağlılığı Kaldırma (`-?`):** 
  `type MyRequired<T> = { [P in keyof T]-?: T[P] };` -> `Required<T>`
* **Salt-Okunurluğu Kaldırma (`-readonly`):** 
  `type Mutable<T> = { -readonly [P in keyof T]: T[P] };` -> *(TypeScript'te yerleşik değil, kendin yazmalısın)*

## 4. Pick ve Record Karşılaştırması

| Özellik | `Pick<T, K>` | `Record<K, V>` |
| :--- | :--- | :--- |
| **Anahtarların Kaynağı** | Mevcut bir tipten süzülür (`K extends keyof T`) | Dışarıdan doğrudan verilir (`K extends keyof any`) |
| **Değer Tipi** | Her anahtarın orijinal tipi korunur (`T[P]`) | Tüm anahtarlar için aynı tip atanır (`V`) |
| **Amacı** | Var olan tipi daraltmak / alt küme oluşturmak | Sıfırdan sözlük (dictionary/map) kurmak |

## 5. Kritik Tuzaklar ve Sektör Pratikleri
* **Eş-yapılı (Homomorphic) Koruma:** Döngüyü tam `[P in keyof T]` şeklinde yazarsan TS orijinal tipteki `?` ve `readonly` işaretlerini korur. Araya kendi listeni (örn. `K`) sokarsan bu koruma kalkar.
* **Partial Yüzeyseldir (Shallow):** `Partial<Config>` sadece en üst seviyedeki alanları isteğe bağlı yapar, iç içe nesnelerdeki alanlar zorunlu kalmaya devam eder.
* **Partial Bulaşıcıdır:** Nesne **oluştururken** (create) `Partial` kullanılmaz, aksi halde eksik veri hataları çalışma anına (runtime) sızar. `Partial` sadece veri **güncellerken** (update/patch) kullanılır.
* **Form Tipleri:** Formlar için genelde `Partial<User>` yerine, değerleri `string` olan ayrı bir form tipi (`Record` veya eşlemeli tip ile) türetmek daha doğrudur.

## 6. Sınır (Koşullu Tipler)
`Omit`, `Exclude`, `Extract`, `ReturnType` gibi utility tipler **eşlemeli (mapped) tip değildir**. Bunlar koşullu (conditional) tiplerdir ve farklı bir soru/cevap mantığıyla çalışırlar.