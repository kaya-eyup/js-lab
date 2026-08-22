# Gün 7 — Konsolidasyon + Veri Dönüşümü

**Kural:** `for`, `while`, `for/of` yok. Sadece dizi ve nesne metotları.
**Veri:** `veri.js` içindeki `hamVeri`. 8 kayıt — her sonucu elle doğrulayabilirsin.
**Amaç:** yeni konu öğrenmek değil. Gün 1-6'da ayrı ayrı öğrendiğin parçaların **tek bir boru hattında** nasıl birleştiğini görmek.

---

## 0. Bugünün çekirdek fikri: veri dönüşümü 4 hamledir

Önce mantık, terimsiz.

Elinde ham bir liste var, birinden bir soru geliyor: *"şehir başına ciro nedir?"* Bu soruya giden yol her zaman aynı dört hamledir:

1. **Temizle** — "İzmir" ile "izmir" aynı şehir mi? `"450"` ile `450` aynı fiyat mı? Bunu hesabın ortasında değil, en başta **bir kez** çözersin.
2. **Daralt** — iptal siparişler ciroya girmez. Gereksiz satırları at.
3. **Şekil değiştir** — sipariş listesi mi lazım, kalem listesi mi? Hangi seviyede çalıştığını seç.
4. **Özetle** — listeyi tek bir cevaba indir.

Örnek, elle:

```
ham:      [ {sehir:"İzmir", tutar:"120"}, {sehir:"izmir", tutar:30, iptal:true}, {sehir:"İZMİR", tutar:50} ]
1 temizle → [ {sehir:"izmir", tutar:120}, {sehir:"izmir", tutar:30, iptal:true}, {sehir:"izmir", tutar:50} ]
2 daralt  → [ {sehir:"izmir", tutar:120}, {sehir:"izmir", tutar:50} ]
3 şekil   → [ ["izmir",120], ["izmir",50] ]
4 özetle  → { izmir: 170 }
```

Şimdi terimler:

- Bu dört hamlenin arka arkaya dizilmesine **veri boru hattı (data pipeline)** denir. Her hamle bir öncekinin çıktısını alır, kendi çıktısını verir; hiçbiri girdisini bozmaz.
- Adım 1'e **normalleştirme (normalization)** denir: farklı yazılmış ama aynı anlama gelen değerleri tek bir biçime çekmek.
- Normalleştirmenin yapıldığı yere **sınır (boundary)** denir. Sektör kuralı şudur: **veri sisteme girerken temizlenir, içeride bir daha sorgulanmaz.** İçeride her `map` içinde "acaba string mi" diye kontrol ediyorsan, o kontrolü 20 yere kopyalamışsın demektir; birini unutursun ve hata sessizce sızar.

**Sıra kuralı (senior refleksi):**
`normalleştir → filtrele → dönüştür → grupla → özetle → sırala`
Filtre map'ten **önce** gelir (daha az satırı dönüştürürsün). Sıralama **en sona** gelir (en küçük listeyi sıralarsın). Bu bir mikro-optimizasyon değil, okunabilirlik kuralıdır: kimse `sort` içinde `filter` görmek istemez.

---

## 1. Konteyner seçimi — "neyi nerede kullanmalı"

Yine önce mantık.

Elinde 3 farklı ihtiyaç var:
- *"Sıraya dizilmiş, tekrar edebilen kayıtlar"* → sipariş listesi.
- *"Bir kaydın sabit alanları"* → `{ id, tarih, durum }`. Alan isimlerini sen kodda yazıyorsun.
- *"Anahtarları verinin kendisinden gelen bir defter"* → şehir isimleri; kaç tane olduğunu, ne olduğunu önceden bilmiyorsun.
- *"Sadece 'bunu daha önce gördüm mü'"* → tekrar eden id'leri yakalamak.

Bu dördü farklı kaplar ister:

| İhtiyaç | Kap | Neden |
|---|---|---|
| Sıralı, tekrar edebilen kayıtlar | **Dizi (Array)** | Sıra korunur, index'le erişilir |
| Sabit, kodda yazılı alan adları | **Nesne (Object)** | Okunaklı, JSON'a doğrudan çevrilir |
| Anahtarı veriden gelen defter | **Map** | Ekleme sırası korunur, anahtar string olmak zorunda değil, `size` var, prototip kirliliği yok |
| "Var mı / yok mu", tekillik | **Set** | Tek işi bu, `has` sabit maliyetli |

**Nesne yerine Map ne zaman?** Anahtarı sen değil veri belirliyorsa. `veri["constructor"]` gibi bir anahtar geldiğinde düz nesne sana miras gelen bir fonksiyon döndürür; `Map` döndürmez. Ayrıca `Map`'in anahtarı nesne olabilir — düz nesnede her anahtar metne çevrilir ve iki farklı nesne aynı `"[object Object]"` anahtarına çakışır (Gün 6).

**Ama:** `Map` `JSON.stringify` ile `{}` olur. API'ye gönderirken düz nesneye/diziye çevirmen gerekir. Bu yüzden sektörde yaygın kalıp: **hesap `Map` ile yapılır, çıktı düz nesneye çevrilir.**

---

## 2. Blok 0 — devreden borç (≈45 dk)

Gün 5-6'dan yazılmamış iki fonksiyon var. Bunlar bugünün problemlerinden önce yazılacak, çünkü ikisi de bugünkü boru hattında kullanılabilir.

### B1 — `once` (sonuç saklayan sürüm)

Mantık: bir işi sadece ilk çağrıda gerçekten yap; sonraki çağrılarda **ilk seferde ürettiğin sonucu** geri ver. Örnek: veritabanı bağlantısını bir kez kur, sonraki her istek aynı bağlantıyı alsın.

```js
const kur = once(() => { console.log("kuruluyor"); return { baglanti: 1 }; });
kur(); // "kuruluyor" yazar, {baglanti:1} döner
kur(); // hiçbir şey yazmaz, AYNI {baglanti:1} döner
```

Yaz. Sonra kendine sor: sonucu nerede sakladın, o değişken çağrılar arasında neden yaşamaya devam etti? (Cevabında **kapanış (closure)** terimi geçmeli.)

### B2 — `memoize`

Mantık: pahalı bir hesabın sonucunu argümanına göre defterine yaz; aynı argüman tekrar gelirse hesaplama, defterden oku.

```js
const kare = memoize(n => { console.log("hesaplanıyor"); return n * n; });
kare(4); // "hesaplanıyor", 16
kare(4); // 16  (yazı yok)
```

Yazdıktan sonra üç soruyu cevapla — asıl egzersiz bunlar:
1. Defteri `Map` mi düz nesne mi yaptın, neden?
2. Fonksiyon iki argüman alırsa anahtarı nasıl üretirsin? `JSON.stringify(args)` çözüm mü, tuzak mı?
3. Bu defter hiç temizlenmiyor. Bu bir **bellek sızıntısı (memory leak)** mı? Hangi durumda evet, hangi durumda hayır?

> `debounce` ve `throttle`'ı bugün yazma. İkisinin de anlamı bir **olay akışını** yavaşlatmaktır (tuşa basma, kaydırma). Olaylar Gün 8'de geliyor; `setTimeout` ile taklit ederek yazarsan mekanizmayı görürsün ama *niye var olduğunu* görmezsin. Gün 8'e taşı.

---

## 3. Blok 1 — 20 problem (≈2.5 saat)

Her problem için önce **tahminini yorum satırına yaz**, sonra çalıştır. Tutmayan tahmin bugünün asıl çıktısı.

### Aşama 1 — Güvenilir veri (P1-P4)

> **Mantık:** Ham veride aynı şey birden çok biçimde yazılmış. Fiyat bazen `850`, bazen `"450"`, bazen `null`. Şehir bazen `"İzmir"`, bazen `"izmir"`. Eğer bunu her hesapta ayrı ayrı kontrol edersen, kod 20 yerde aynı kontrolü taşır. Tek bir yerde, en başta çöz.
> **Örnek:** `"450"` → `450` · `"  ayşe YILMAZ "` → `"ayşe yılmaz"` · `"Elektronik"` → `"elektronik"`
> **Terim:** buna **normalleştirme (normalization)** denir; sonucuna da **temiz veri / kanonik biçim (canonical form)** denir.

**P1 — `sayiyaCevir(deger)`**
`"450"`, `450`, `null`, `undefined`, `""`, `"3"`, `"2 adet"` girdilerini test et.
Karar ver: geçersiz girdide `0` mı dönmeli, `null` mı, yoksa hata mı fırlatmalı? Kararını ve **gerekçesini** yaz.
İpucu / Gün 3 borcu: `isNaN("")` neden `false` döner? `Number("")` kaçtır? Bu ikisi birleşince boş string sayı kontrolünden nasıl sızıyor?

**P2 — `metinNormalize(str)`**
Baştaki/sondaki boşluğu at, küçük harfe çevir. Türkçe: `"İZMİR".toLowerCase()` ile `"İZMİR".toLocaleLowerCase("tr-TR")` sonuçlarını yan yana yazdır ve farkı log'a geçir.

**P3 — `kalemNormalize(kalem)`**
Bir kalemi `{ urun, kategori, fiyat, adet, satirToplami }` biçimine çevir. Orijinal nesneye **dokunma** — yeni nesne döndür.
Kendini kontrol et: `fiyat: null` olan "Masa" kalemi ne oldu? Ürün gerçekten bedava mı, yoksa verisi mi eksik? İkisi farklı şeyler; hangisini seçtiğini yaz.

**P4 — `siparisNormalize(siparis)`**
`musteri: null` olan SIP-1005 çökmeden geçmeli. `siparis.musteri.sehir` yazarsan ne olur — önce tahmin et, sonra çalıştır.

Çıktı: `const temiz = hamVeri.map(siparisNormalize);`

---

### Aşama 2 — Daraltma ve düzleştirme (P5-P8)

> **Mantık:** Veri iç içe: sipariş → kalemler. "En pahalı ürün hangisi?" sorusunun cevabı sipariş seviyesinde yok, kalem seviyesinde var. Yani önce **hangi seviyede çalıştığına** karar vermelisin. İç listeleri tek bir düz listede toplamak bunun adı.
> **Örnek:** `[{k:[a,b]}, {k:[c]}]` → `[a, b, c]`
> **Terim:** buna **düzleştirme (flattening)** denir; `flatMap` bunu tek adımda yapar.
> **Senior detayı:** düzleştirirken **bağlam kaybolur**. `a` düz listeye girdiğinde artık hangi siparişe ait olduğunu bilmez. Bu yüzden düzleştirirken taşınması gereken alanları kaleme kopyalarsın.

**P5** — İptal olmayan siparişler. Dikkat: `"iptal"` ve `"İptal"` ikisi de var. Aşama 1'i yaptıysan bu problem tek satır.

**P6** — Tüm kalemleri tek düz liste yap; her kaleme `siparisId` ve `sehir` ekle.

**P7 — Tekilleştirme.** SIP-1002 iki kez var.
Önce `new Set(temiz).size` yaz ve sonucu tahmin et. Neden 8 çıktı?
Sonra id'ye göre tekilleştir. Bunun dört adımı var: *anahtarı seç → defter aç → daha önce gördüysen atla → defterin değerlerini diziye çevir.*
Soru: iki kayıt farklıysa hangisini tutarsın — ilki mi sonuncusu mu? Bu bir **iş kararı**, teknik karar değil. Kararını yaz.

**P8** — Her siparişe `toplam` ekle. Kural: `temiz` dizisi ve içindeki nesneler **değişmemiş** olmalı. Bittikten sonra `temiz[0].toplam` yazdır — `undefined` çıkmalı. Çıkmıyorsa nerede mutasyon yaptığını bul.

---

### Aşama 3 — Gruplama (P9-P13)

> **Mantık:** "Şehir başına ciro" aslında **iki iş**: önce satırları etiketine göre kutulara ayır, sonra her kutuyu tek sayıya indir. Çoğu kişi bunu tek adımda yapmaya çalışır ve `reduce` içinde kaybolur. Ayır, sonra topla.
> **Örnek:**
> ```
> [ izmir:120, ankara:50, izmir:30 ]
>   ayır  → { izmir: [120, 30], ankara: [50] }
>   topla → { izmir: 150,       ankara: 50   }
> ```
> **Terim:** ilk adıma **gruplama (grouping)**, gruplama için kullanılan alana **anahtar (key)** denir. Modern JS'te hazırı var: `Object.groupBy` ve `Map.groupBy`.

**P9 — `grupla(dizi, anahtarFn)`** — kendin yaz, `reduce` ile, `Map` döndür.
`grupla(kalemler, k => k.kategori)` → `Map { "elektronik" => [...], "kitap" => [...] }`
Bu bugünün en önemli fonksiyonu. Hazırını kullanmadan önce mekanizmasını yazmış olman lazım.

**P10** — Şehir → sipariş sayısı.

**P11** — Kategori → toplam ciro.

**P12** — Müşteri → siparişleri. Ayşe hem `"  ayşe YILMAZ "` hem `"Ayşe Yılmaz"` olarak geçiyor.
Adla gruplarsan ne olur? Id'yle gruplarsan? Bir alanın **kimlik taşıyıp taşımadığına** nasıl karar verirsin — kural nedir?

**P13 — Ortam kanıtı.** `typeof Map.groupBy` yazdır. Varsa P9'la aynı veriyi ver, iki sonucu karşılaştır. Sonucu log'un "Kanıtlanan ortam bilgisi" bölümüne geçir (Node sürümüyle birlikte).

---

### Aşama 4 — Özetleme (P14-P17)

> **Mantık:** Bir listeyi tek bir cevaba indirmek. Ama "tek cevap" sayı olmak zorunda değil — bir rapor nesnesi de olabilir. Asıl tuzak şu: **liste boşsa ne dönecek?** Buna önceden karar vermezsen kodun sessizce `NaN` veya `-Infinity` üretir ve bu değer sistemin içine sızar.
> **Örnek:** `[].reduce((a,b) => a+b)` → TypeError · `Math.max(...[])` → `-Infinity` · `0/0` → `NaN`
> **Terim:** listeyi tek değere indirmeye **indirgeme (reduce/fold)**, "boş liste", "tek eleman", "null alan" gibi sınır durumlara **kenar durum (edge case)** denir.

**P14 — `ortalama(dizi)`** — Gün 3 borcu. Boş dizide ne dönmeli? `0` mı, `null` mı, hata mı? Üçünün de savunulabilir olduğu bir bağlam yaz, sonra birini seç.

**P15 — En pahalı kalem.** `reduce` ile yaz. Sonra `toSorted(...)[0]` ile de yaz. İkisini karşılaştır: hangisi tek geçişte biter, hangisi tüm listeyi sıralar? Küçük veride fark var mı, 100.000 kayıtta?

**P16 — Tek geçişte rapor.** Kalem listesinden `{ adet, ciro, enUcuz, enPahali, ortalama }` üret — listeyi **bir kez** dolaşarak.

**P17 — Şehir bazında istatistik.** `Map { "izmir" => { siparisSayisi, ciro, ortalamaSepet } }`. Aşama 3'ün grupla'sını kullan, tekrar yazma.

---

### Aşama 5 — Sıralama ve final (P18-P20)

> **Mantık:** Bir listeyi sıralamak için JS'e "hangisi önce gelir?" sorusuna cevap veren bir fonksiyon vermelisin. Vermezsen JS her şeyi metne çevirip alfabetik sıralar — bu yüzden `[10, 9, 100]` sıralandığında `[10, 100, 9]` çıkar. Ayrıca `sort` diziyi **yerinde bozar**, yani girdi dizin geri dönülemez şekilde değişir.
> **Örnek:** `[10,9,100].sort()` → `[10,100,9]` · `[10,9,100].sort((a,b)=>a-b)` → `[9,10,100]`
> **Terim:** o karşılaştırma fonksiyonuna **karşılaştırıcı (comparator)** denir. Diziyi bozan metotlara **mutasyon yapan (mutating / in-place)**, kopya döndürenlere **mutasyon yapmayan (non-mutating)** denir — `sort` birincisi, `toSorted` ikincisi.

**P18** — Şehirleri ciroya göre azalan sırala. `Map`'i diziye nasıl çevirirsin?

**P19 — İki anahtarlı sıralama.** Önce ciro azalan; ciro eşitse şehir adı alfabetik. Türkçe sıralamada `"ç"` ile `"c"` nereye düşüyor — `<` operatörü ile `localeCompare("tr")` sonuçlarını karşılaştır.

**P20 — Final: `rapor(hamVeri)`**
Bugünkü her şeyi tek fonksiyonda birleştir. Çıktı şekli:

```js
{
  toplamSiparis: Number,
  toplamCiro: Number,
  sehirler: [ { sehir, siparisSayisi, ciro, ortalamaSepet } ],  // ciroya göre azalan
  kategoriler: [ { kategori, ciro } ],                          // ciroya göre azalan
  enCokSatan: { urun, toplamAdet },
  atlananKayitlar: [ { id, sebep } ]
}
```

Üç şart:
1. `rapor(hamVeri)` çağrıldıktan sonra `hamVeri` **birebir aynı** olmalı. Kanıtla.
2. Aynı girdi her zaman aynı çıktıyı vermeli. Girdisi dışında hiçbir şeye bakmayan, dışarıda hiçbir şeyi değiştirmeyen fonksiyona **saf fonksiyon (pure function)** denir; test edilebilirliğin tamamı buradan gelir.
3. `atlananKayitlar` boş kalmamalı. Sessizce atılan veri, en pahalı hata türüdür — atarken **sebebini kaydet.**

---

## 4. Blok 2 — Blok A sınavı (30 dk, nota bakmak yok)

Kodla değil, **cümleyle** cevapla. Cevaplayamadığın her soru park.md'ye gider.

1. `var`, `let`, `const` — üçünün farkı ne? `const` ile tanımlanmış bir dizinin içine `push` yapabilir miyim, neden?
2. `[] == false` neden `true`? `null == 0` neden `false`?
3. `a = b` satırı, `b` bir sayıyken ve `b` bir nesneyken ne farkla çalışır?
4. Yüzeysel kopya neyi kopyalar, neyi kopyalamaz? `{...obj}` hangi durumda seni yanıltır?
5. Kapanış (closure) nedir — 2 cümle + 3 satır kod. "Fonksiyonun içindeki fonksiyon" cevabı kabul değil.
6. Bir fonksiyonun içindeki `this`'in ne olacağını belirleyen şey nedir?
7. `bind` ile bağlanmış bir fonksiyona ikinci kez `bind` uygularsam ne olur, neden?
8. Dizide `for/in` neden kullanılmaz? En az iki somut sebep.
9. `[...birSey]` yazabilmem için `birSey`'in neye sahip olması gerekir?
10. `Map`'i düz nesneye tercih etmen için üç somut sebep. Tersi için bir sebep.
11. Aynı içerikli iki nesneyi `Set`'e koyduğumda neden ikisi de kalır?
12. `try` içinde `return` var, `finally` içinde de `return` var. Hangisi kazanır?
13. `catch {}` neden sektörde en tehlikeli anti-kalıplardan sayılır? Hatayı yutmak yerine iki seçeneğin ne?
14. Mutasyon yapan 4 dizi metodu, yapmayan 4 dizi metodu say. `sort` hangisi, `toSorted` hangisi?

---

## 5. Blok 3 — Gün 1-3 refactor (≈60 dk)

Eski kodu "daha güzel" yapmak için değil, **bugünkü gözünle ne gördüğünü ölçmek için** açıyorsun. Kontrol listesi:

- [ ] `for` döngüsü var mı? Metotla yazılabilir miydi — yazılamıyorsa neden?
- [ ] `sort` çağrısı var mı? Girdiyi bozuyor mu? `toSorted` uygun mu?
- [ ] `==` kullandığın yer var mı? Kasıtlı mıydı?
- [ ] Aynı kontrolü birden fazla yerde yapıyor musun? (→ normalleştirmeye çek)
- [ ] Fonksiyonlarından hangileri saf değil? Neden değil?
- [ ] `ortalamaHesapla` boş dizide hâlâ `NaN` mı?
- [ ] Yorum satırı ne anlatıyor: *ne yaptığını* mı, *neden yaptığını* mı? Birincisiyse sil, kod zaten söylüyor.

**Commit mesajı kuralı:** `refactor: gun-01 sayı kontrolü normalleştirmeye taşındı` — ne değil, **neden**.

---

## 6. Tuzak listesi — sadece 20 problem bittikten SONRA aç

<details>
<summary>Aç</summary>

Veriye kasten yerleştirilen 8 tuzak:

1. `fiyat: "450"` — string. `"450" * 2` çalışır ama `"450" + 450` çalışmaz.
2. `adet: "3"` — string. `reduce` toplamasında sessizce metin birleştirme yapabilir.
3. `fiyat: null` (Masa) — `null * 1` → `0`. Bedava mı, eksik veri mi?
4. `musteri: null` (SIP-1005) — zincirleme erişim çöker.
5. `kalemler: []` (SIP-1006) — ortalama `NaN`, `Math.max(...[])` → `-Infinity`.
6. SIP-1002 iki kez — `Set` yakalamaz, çünkü farklı referans.
7. `"İzmir"` / `"izmir"` / `"İZMİR"` — `toLowerCase()` Türkçe'de `"İ"`'yi doğru çevirmez.
8. `"iptal"` / `"İptal"` — filtre birini kaçırır.

Kaç tanesini kendin buldun? Bulamadıklarını log'a yaz — asıl ölçüm bu.

</details>

---

## Günün çıktısı

- `src/gun-07/` → `veri.js`, `normalize.js`, `donusum.js`, `rapor.js`, `sinav.md`
- En az 3 commit
- `logs/gun-07.md` → standart iskelet
- `park.md` → sınavda cevaplayamadığın her soru
