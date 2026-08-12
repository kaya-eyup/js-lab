## Gün 01 — 12 Ağustos 2026
**Konu:** Tipler, hoisting, TDZ, referans vs primitive
**Bugün açıklayamadığım şey:** isNan fonksiyonu, ve kullanımı
**Yaptığım deney ve şaşırtan sonuç:** 

console.log(typeof null) = object değerini döndürüyor zira verinin tipini anlamak için tanımlanan tanımlayıcı, bloğunun 3 tane bit  değerine bakıyor, null tamamen 0lardan oluşur, object de sadece 3 0dan oluştuğu için derleyici id tag değerlerine bakarak aynı zannediyor. yazılım dillerinde bu tür hatalar düzeltil(e)miyor çünkü bütünsistemler jse bağlı ve hepsini güncellesek sistem çöker.

NaN, tanımlanamayan bi değer hiçbirşeye eşit olamaz, başka bir Nan de dahil zira aynı mantık. eslint de bunu daha yazma aşamasında görüp isNan fonksiyonunu kullan diyor, sebebine baktım , sayısal değere çevirip tip kontrolü yapmak gibi birşey diyor ama kafam karıştı tam anlayamadım.

editöre 0.1 yazdığım sayı, binary sistemde ondalık uzantılarının artması nedeniyle başka ondalık sayıyla toplandığında sonsuz defa virgül sonrası yazamayacağı içiin aynı insanlar gibi bi noktadan sonra yuvarlar, bütün ondalıklı değerleri tam sayıya çevirerek düzeltilebilir. mesela tl yerine kuruş cinsinden yazım.
aynı sebepten ötürü, 0.1 ile 0.2nin toplamı 0.3e eşit diyemez konsolda. 

JS motoru kodu tam çalıştırmadan önce yüzeysel bir tarama (parse) yapıyor ve tıpkı bir tiyatro oyununun senaryo kağıdı gibi değişken ve fonksiyon bildirimlerini en yukarı çekiyor (Hoisting). `var` değişkeni direkt en üste çıkıyor; ancak değer atamasının yapıldığı satırdan önce çağrılırsa `undefined` çıktısı veriyor. Çünkü o noktaya gelinene kadar bellek alanı ayrılmış olsa da henüz değeri tanımlanmamıştı.

`let` ve `const`, `var`'ın getirdiği birçok soruna çözüm olduğu gibi bu duruma da standart getirdi. Derleyici / JS motoru seviyesinde `let` (değeri sonradan değiştirilebilir durumlar için, örneğin stok sayısı) ve `const` (değiştirilemez sabitler için) henüz tanımlanmadan çağrılmaya çalışılırsa hata fırlatıyor. Bu değişkenlerin en üste çekildiği (hoist edildiği) an ile kodda gerçekten tanımlandıkları satır arasında kalan o erişilemez bölgeye TDZ (Temporal Dead Zone - Temporal Ölü Bölge) deniyor. 

Peki TDZ'ye dokununca neden `ReferenceError` alıyoruz ve TDZ'nin önemi ne?  
Aslında `let` ve `const` da hoist edilir; fakat `var` gibi `undefined` ile ilklendirilmez (initialize edilmez), bellek bölgesi "uninitialized" olarak işaretlenir. JS motoru, sen tanımlama satırına gelene kadar bu değişkene erişim çabanı gördüğü an "Bu değişken var ama henüz erişime hazır değil, kural dışı erişim yapıyorsun!" diyerek güvenli tarafta kalmak adına `ReferenceError` fırlatır. TDZ’nin temel önemi; henüz ilklendirilmemiş, yarım yamalak değişkenlerle sessizce çalışıp ileride tespiti zor mantık hataları (`bug`) üretmek yerine, geliştiriciyi daha kodun başında sertçe uyararak daha güvenli ve öngörülebilir bir kod yazmaya zorlamasıdır.

Fonksiyonlarda ise durum biraz farklı:
* Function Declaration (Normal fonksiyon tanımlaması): Fonksiyon gövdesi komple (tam blok şeklinde) hoist edilir. Bu yüzden fonksiyonu tanımladığın satırdan önce de çağırsan sorunsuz çalışır.
* Function Expression (Fonksiyonu bir değişkene atama): Burada fonksiyonun kaderini atandığı değişken belirler:
  * `var` ile tanımlandıysa: Değişken en üste `undefined` olarak çekilir. Tanımlamadan önce çağırmaya çalışırsan JS motoru *"Sen `undefined` olan bir şeyi fonksiyon gibi çağırmaya çalışıyorsun"* der ve `TypeError: ... is not a function` hatası basar.
  * `let` veya `const` ile tanımlandıysa: Değişken TDZ'ye takılır ve henüz ilklendirilmediği için direkt `ReferenceError` alırsın.

Block Scope ve `if` Blokları Meselesi:  
`if`, `for` veya süslü parantez `{}` ile oluşturulan her alan bir Block Scope'tur. `var` değişkeni bu süslü parantezleri (block) umursamaz, dışarı sızar (Function Scope'tur). Ancak `let` ve `const` süslü parantezlerin içinde hapsolur. Bir `if` bloğu içinde `let` veya `const` ile tanımladığın değişken, o `if` bloğunun dışından çağrılamaz; çağırırsan JS motoru o değişkenin dışarıda varlığından bile haberdar olmadığı için yine `ReferenceError` verir.

**Verdiğim karar ve gerekçesi:** var yeteri kadar güvenli olmadığı için değiştirilebilir değerlerde let, değiştirilemez değerlerde const kullanacağım, sektör standardı ve senior bakış açısı da aynı şeyi söylüyor. 

**Yarına devir:** Hoisting ve TDZ konularını daha uzun vadeli ve zamana yayarak anlamak gerekiyor. primitive ve references için saat çok geç olduğu için yarın bakacağım.


**Süre:** izleme 1s / kod 4s / okuma 2s