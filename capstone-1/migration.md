 1. Harita: Migration
1.1 Migration ne demek, ne demek değil

İçinde oturduğun evin elektrik tesisatını yenilediğini düşün. İki yolun var. Ya evi boşaltıp her şeyi söküp baştan döşersin, ya da oda oda ilerlersin ve her akşam ışıklar yine yanar. İkinci yolda bir şey bozulursa hangi odada bozulduğunu bilirsin.

İkinci yolun adı kademeli geçiş (incremental migration), birincisinin adı büyük patlama (big bang migration). Sektörde varsayılan kademeli geçiştir. Her commit'te uygulama çalışır. İşin ortasında durmak zorunda kalırsan elinde yarım ama çalışan bir proje olur.

Bundan üç kural çıkıyor:

Geçiş davranışı değiştirmez. Bir dosyayı çevirirken bir hata fark edebilirsin; TS'in ilk faydası zaten budur. Düzeltmeyi ayrı bir commit'e koy. "Çevir + düzelt" tek commit'te olursa ve bir şey bozulursa, bozanın tip mi mantık mı olduğunu ayıramazsın. Bugün davranışı bilerek değiştiren tek adım Adım 4, o yüzden ayrı duruyor.

Yeniden adlandırma ayrı commit. Git bir dosyanın taşındığını içeriğine bakarak tahmin eder. Dosyanın adını değiştirip aynı commit'te içeriğinin yarısından fazlasını da değiştirirsen, Git "eski dosya silindi, yeni bir dosya geldi" sanar ve dosyanın geçmişi kopar (git log --follow, git blame). O yüzden her dosya için önce git mv + import yolu düzeltmesi commit'i, sonra tip commit'i gelir. Aradaki commit'te typecheck kırmızı olabilir, uygulama yine çalışır. İkisini birlikte push'la.

Her any kayıt altında (müfredat kuralı). Logda şu tabloyu tut:

Dosya:satır	Yazdım / sızdı	Gerekçe	Kaldırılabilir mi?

"Sızdı" sütunu önemli: bir de senin yazmadığın, kütüphaneden içeri giren any var. Onu 1.5'te anlatıyorum.

Gerçek işte: 300 dosyalık bir şirket projesine strict: true ile başlayamazsın. İlk gün binlerce hata çıkar ve özellik geliştirme durur. Orada ekipler gevşek bir ayarla başlar ve sıkılık bayraklarını tek tek açar. Biz baştan sıkı başlıyoruz, çünkü proje küçük. Bu lüksün tek sebebi boyut.

1.2 Sıra: yapraklardan köke

Capstone'daki import zincirine bak: http.js hiçbir şeyi import etmiyor, products.js onu import ediyor, actions.js de products.js'i. Önce http'yi çevirirsen, products.js'i çevirdiğinde TS http()'nin ne döndürdüğünü zaten bilir. Ters sırada gidersen her dosyada "bu ne döndürüyor, bilmiyorum" sorusuyla uğraşırsın.

Dosyaların birbirini import ettiği bu ağa bağımlılık grafiği (dependency graph) denir. Hiçbir şeyi import etmeyen uç dosyalara da yaprak (leaf) denir. Kural: yapraktan başla, köke (main) doğru çık.

actions ──► api/products ──► lib/http            ← bugün, sağdan sola
lib/debounce · lib/escapeHtml                    ← bugün (yapraklar)
main · router · store · render · views · actions ← sonraki günler

Veri katmanının önce gelmesinin ikinci sebebi: tipler orada doğar. Product tipi api/ içinde tanımlanır, store onu tutar, view onu okur. View'dan başlarsan ürünün şeklini view'da tahmin edersin, sonra veri katmanını o tahmine uydurmaya çalışırsın. Yani bilgi ters yönde akar.

1.3 Karışık dönem: JS ile TS yan yana

Bugün akşam projenin yarısı .js, yarısı .ts olacak ve yine çalışması gerekiyor. Bunun için TS'e iki şey söylemen lazım: ".js dosyalarını da projeye dahil et" ve "ama varsayılan olarak onları denetleme". Başında // @ts-check yazan JS dosyaları ise bugün olduğu gibi denetlenmeye devam eder.

Bunu yapan ayarlar allowJs: true ve checkJs: false. jsconfig.json aslında "JS projeleri için tsconfig"tir. tsconfig.json gelince silinir; ikisi aynı klasörde kalırsa editörün hangisini okuduğunu tahmin etmek zorunda kalırsın.

Çevirdiğin her dosyada iki tuzak var:

JSDoc, .ts içinde tip sayılmaz. /** @param {string} q */ bir JS dosyasında tiptir. Dosyanın uzantısı .ts olduğu an sadece bir yorumdur. JSDoc'taki tipleri gerçek tip yazımına taşı, sonra sil. Açıklama cümleleri kalabilir.
Import yolları. http.js dosyası http.ts oldu ama onu import eden dosya hâlâ http.js yazıyor. Vite TS şablonunun standardı, yola gerçek dosya adını yazmaktır (../lib/http.ts). Yol eşleşmezse ya derleyici ya tarayıcı itiraz eder, o yüzden ikisini de kontrol edeceğiz.
1.4 İki ayrı araç: çalıştıran ve denetleyen

Vite bir .ts dosyasını tarayıcıya verirken tip yazılarını siler ve kalanını çalıştırır. Tiplerin doğru olup olmadığına bakmaz; yazım denetimi yapmayan bir yazıcı gibi çalışır. Denetimi yalnızca tsc yapar, o da bizde (noEmit) hiçbir şey çalıştırmaz. Sonuç: kırmızı bir tip hatası varken uygulama tarayıcıda sorunsuz çalışabilir. Deney 1 bunu ölçecek.

Sektör standardı: build scripti "tsc && vite build" şeklindedir, yani denetim geçmeden paket çıkmaz. Bir de sürekli entegrasyon (CI, continuous integration) vardır: kod depoya her gönderildiğinde otomatik çalışan denetim hattı. Typecheck orada ayrı bir adımdır. "Editörde kırmızı yok" bir kanıt değildir; kanıt npm run typecheck çıktısıdır.

Bu ayrılık iki ayarın da sebebidir. Vite dosyaları tek tek ve tip bilgisi olmadan çevirir. Bu yüzden bir import'un tip mi değer mi olduğunu satırın kendisinden anlayabilmesi gerekir. Sadece tip getiren bir import'u import type ile işaretlemeni zorunlu kılan ayar verbatimModuleSyntax. Aynı sebeple, silindiğinde geride kod bırakan TS sözdizimini yasaklayan ayar da erasableSyntaxOnly. Vite'ın güncel TS şablonu ikisini de varsayılan olarak açıyor. Bugün HttpError'da bu ayar karşına gerçek bir karar olarak çıkacak. 
GitHub

Bir not daha: TypeScript 6.0 varsayılanları değiştirdi: strict artık varsayılan olarak açık, types da boş dizi oldu, yani @types paketleri artık kendiliğinden yüklenmiyor. Müfredat "strict: true ile başla" diyor. Bu ayar zaten varsayılan olsa da açıkça yazacağız, çünkü ayar dosyası niyeti belgeler ve bir sonraki sürüm varsayılanı değiştirse bile projen etkilenmez. 
OpenReplay
TypeScript

1.5 Sınır: tipin yalan söyleyebildiği tek yer

Kendi kodunun içindeki her değeri TS görür: nereden geldiğini de, ne olduğunu da. Ama dummyjson'dan gelen cevap derleme sırasında yok; tarayıcıda, çalışırken gelir. Sunucu yarın price alanını "12.99" gibi bir metne çevirirse TS'in bundan haberi olmaz. O cevaba bir tip yapıştırmak (as Product, http<Product>()) "bana güven" demektir. Gün 21'in cümlesiyle: tip sistemi bir iddia sistemidir, doğrulama sistemi değildir.

Güvenmediğin dış dünyanın bitip kendi kodunun başladığı çizgiye güven sınırı (trust boundary) denir. Sektör standardı şu:

Sınırdan geçen değer unknown olarak girer.
Ayrıştırılır (parsing): alan alan kontrol edilir ve beyaz listedeki alanlardan yeni bir nesne kurulur.
İçeri artık kontrol edilmiş tipiyle yayılır.

Kontrol bir kez ve sınırda yapılır; içeride kimse tekrar kontrol etmez. Bizde sınır api/products.ts. http.ts cevabın şeklini bilmez (katman tablosunda şekli api/ bilir), o yüzden onun dürüst dönüş tipi unknown olur.

İki sızıntı noktası var:

response.json() tarayıcı tiplerinde Promise<any> döner. noImplicitAny bunu yakalamaz, çünkü any'yi sen yazmadın, kütüphane verdi (Gün 19'daki bulaşıcı any). Bu satır any kaydına "sızdı" olarak girer ve unknown'a çevrilir.
catch (err): strict altında err unknown olur. err.name === "AbortError" derlenmez; önce daraltman gerekir.

Gerçek işte: ASP.NET Core'a geçtiğinde kendi backend'in olacak. Orada sunucu hangi adreslerin, hangi alanların ve hangi tiplerin olduğunu makinenin okuyabileceği bir dosyada yayınlar. Buna OpenAPI sözleşmesi denir ve frontend'in TS tipleri bu dosyadan otomatik üretilir; elle tip yazmazsın. Ama üretilen tip de bir iddiadır: backend ile frontend farklı zamanlarda yayına çıkarsa sözleşme ile gerçek cevap birbirinden ayrılabilir. Dummyjson gibi üçüncü taraf API'lerde sınır doğrulaması neredeyse her zaman yapılır.

zod neden bugün değil: Elle yazacağın ayrıştırıcı uzun ve sıkıcı olacak. Bu bilerek böyle, çünkü zod tam olarak bu sıkıcılığı otomatikleştiren kütüphane. Neyi otomatikleştirdiğini görmeden kullanırsan onu da ezberlenmiş bir sihirli satır olarak öğrenirsin. Bugün ayrıştırıcıyı elle yazacaksın. Sonraki migration gününün ilk işi, aynı ayrıştırıcıyı zod ile yeniden yazıp ikisini karşılaştırmak olacak.





2. Harita: Migration #2
2.1 Bugünün asıl çıktısı: tipin gösterdiği kusurlar

Bir başvuru formu düşün. "Evli misiniz?" sorusuna "Hayır" işaretlenmiş, ama altındaki "Eşinizin adı" kutusu da dolu. Kâğıt buna izin verdiği için bu tutarsız kayıt bir gün mutlaka birinin önüne düşer.

Bugün JS dosyalarını tipledikçe TS bu tür yerleri kırmızıyla gösterecek. Kodun "şans eseri doğru çalıştığı" yerler bunlar. Müfredatın "neden 2 gün" cümlesi tam olarak bunu söylüyor: kazanç tip yazmak değil, mimarindeki kusurları görmek. O yüzden günün asıl çıktısı logdaki şu tablo:

Dosya	Tipin gösterdiği kusur	Nasıl göründü (hata mesajı)	Karar

Dünkü kurallar aynen geçerli. Geçiş davranış değiştirmez; davranışı değiştiren düzeltmeler ayrı commit'e gider. Yeniden adlandırma ayrı commit'tir. Sıra yapraktan köke doğrudur.

2.2 createStore<TState>: dolabı kiralarken içine ne konacağını söylemek

Bir emanet dolabı düşün. Dolabın yapısı her müşteri için aynıdır ve içine ayakkabı mı kitap mı konacağını umursamaz. Ama dolabı kitap için kiraladıysan, görevli oraya ayakkabı sokmaya çalışanı durdurmalıdır.

Store da böyle çalışır. State'i okuyan, değiştiren ve dinleyicilere haber veren kod her uygulamada aynıdır; ürün mü görev listesi mi tuttuğunu bilmesi gerekmez. "İçindekinin türünü" dışarıdan alan fonksiyonun jenerik (generic) olduğunu Gün 21-22'den biliyorsun. TState o türün adı.

ts
// genel şekil, senin dosyan değil
export function createStore<TState>(initial: TState) {
  // içeride state'e dokunan her şey TState ile yazılır
}

const store = createStore<AppState>(initialState); // dolap AppState için kiralandı

Bu adımda bir tuzak var ve dayanağı sende: tipi başlangıç değerinden çıkarmak. <AppState>'i yazmazsan TS dolabın türünü içine konan ilk şeyden tahmin eder. İki sonucu var:

Başlangıçta status: "idle" yazdıysan status'u string sayar, yani "muz" da kabul edilir.
items: [] yazdıysan never[] sayar, yani hiçbir ürün sığmaz.

İkisi de Gün 19'daki 01-cikarim.ts'in bulguları. Bu yüzden sektörde store'un tipi başlangıç değerinden çıkarılmaz, açıkça yazılır.

2.3 FetchState<T>: Gün 20'deki tipin işe girmesi

Bir kargo takip ekranı düşün: "hazırlanıyor", "yolda", "teslim edildi", "iptal". Paket aynı anda hem teslim edilmiş hem iptal olmuş olamaz. "Teslim alan kişi" bilgisi de sadece "teslim edildi" durumunda vardır.

JS state'lerinde sık görülen şekil ayrı ayrı bayraklardır: loading: true, error: "...", items: [...]. Üçü birbirinden bağımsız olduğu için "yükleniyor, ama hata da var, ama ürünler de duruyor" gibi anlamsız bir kombinasyon yazılabilir. Buna imkânsız durum (impossible state) denir. Gün 20'deki FetchState her durumun yanına sadece o durumda anlamlı olan veriyi koyar. Örneğin data'ya ancak status === "success" kontrolünden sonra erişebilirsin.

Bugün yeni olan kısım <T>. Aynı kalıp liste için FetchState<ListResult> olacak, detay ekranı için de ürün tipiyle kurulacak. T'nin değeri api/products.ts'ten gelir; dünkü kural: tipler veri katmanında doğar. Detay ekranında 404'ün state içinde nasıl duracağına senin FetchState dosyanı ve store'unu görünce ben karar vereceğim.

Bir de import kuralı var. Tipler çalışma anında silinir. Bir import satırı sadece tip getiriyorsa, derlemeden sonra geriye boş bir import kalmamalı. Bunu önceden bildirmek için import type { ListResult } from "./api/products.ts" yazılır; derleyici ve Vite bu satırın tamamen silinebileceğini bilir. Buna yalnızca tip içe aktarımı (type-only import) denir. Bugün ilk kez bir dosyadan sadece tip alacaksın; sektörde bu satırlar böyle yazılır.

2.4 Rota tipleri: adres çubuğu da bir sınır

Dün sınırı "dış dünyanın bitip kendi kodunun başladığı çizgi" diye tanımladık ve dummyjson'a uyguladık. Adres çubuğu da dış dünyadır. Kullanıcı oraya /product/, /product/abc ya da /?page=muz yazabilir, eski bir linke tıklayabilir. Router'ın işi bu serbest metni uygulamanın tanıdığı birkaç ekrandan birine çevirmek.

Kural dünküyle aynı: metin sınırda bir kez ayrıştırılır ve içeriye kontrol edilmiş tipiyle girer. Ekranların listesi, FetchState gibi bir etiketli birleşim (discriminated union) olur:

ts
// genel şekil; alan adları senin router'ına göre kesinleşecek
type Route =
  | { name: "list"; q: string; page: number }
  | { name: "detail"; id: string }
  | { name: "notFound" };

Bunun iki kazancı var. Birincisi, içeride kimse "page bir sayı mı?" diye bakmaz, çünkü bu soru sınırda çözüldü. İkincisi, render bu tipin üzerinde switch + assertNever kurduğunda, ileride yeni bir ekran eklersen TS güncellenmesi gereken her yeri kırmızıyla gösterir.

Bu adımda park'taki bir madde de kapanıyor (gun21, noUncheckedIndexedAccess). "/product/12".split("/")[2] sana "12" verir. "/product".split("/")[2] ise undefined verir. TS varsayılan ayarda ikisine de string der, yani yalan söyler. match(...)[1] için de durum aynı. noUncheckedIndexedAccess ayarı, bir diziden indeksle okunan her değere | undefined ekler. Router'da bu yalanla doğal olarak karşılaşacağın için ayarı o adımda açacağız.

Karar: Ayar kalıcı olarak açık kalacak. Gerekçesi ilk gün strict ile başlamamızla aynı: proje küçük, ve çıkan her hata "bu değer olmayabilir" diyen gerçek bir durum.

Gerçek işte: React tarafında kullanılan router kütüphaneleri de aynı işi yapar: adres parametrelerini sınırda doğrular ve içeriye tipli olarak verir. Bugün elle kuracağın şey, onların içinde ne olduğunu gördüğün hâli.

2.5 zod: dünkü sıkıcılığın otomatiği

Dün ProductSummary tipini bir yere, onu kontrol eden parseSummary'yi başka bir yere yazdın. Aynı bilgi, yani "price bir sayıdır", iki yerde duruyor. Biri değişip öbürü değişmezse tip bir şey, kontrol başka bir şey söyler. Gün 23'teki 01-derive.ts'in kuralı burada da geçerli: bilgi tek bir kaynakta durur, gerisi ondan türetilir.

zod'da bu kaynağın adı şema (schema): verinin şeklini çalışma anında kontrol edebilen bir nesne. Tip de şemadan türetilir:

ts
import * as z from "zod";

const ProductSummarySchema = z.object({ id: z.number(), title: z.string() /* ... */ });
type ProductSummary = z.infer<typeof ProductSummarySchema>; // tip şemadan türetildi, ayrıca yazılmadı

const item = ProductSummarySchema.parse(raw); // bozuksa fırlatır, değilse ProductSummary döner

Dünkü iki derdini de çözüyor:

parseProduct'ta nesne kontrolünü ikinci kez yazmak zorunda kalmıştın. zod'da detay şeması, özet şemasının .extend({...}) ile genişletilmiş hâli olur.
z.object, şemada olmayan alanları (dummyjson'ın stock, reviews gibi alanları) varsayılan olarak atar. Gün 23'teki beyaz liste kendiliğinden gelmiş olur.

Karşılaştırmada üç şeyi ölçeceksin: satır sayısı, bozuk bir alanda çıkan hata mesajı (Deney 3'ün productz tekrarı) ve npm run build çıktısındaki JS boyutunun öncesi ve sonrası.

Karar: zod kalıyor, elle yazılan ayrıştırıcılar siliniyor (git geçmişinde duruyorlar). Gerekçesi iki şey: bilgi tek kaynakta duruyor, ve hata mesajı bozuk alanın yerini gösteriyor. Maliyet, yani paket boyutu, ölçülüp README'nin "kararlar" bölümüne yazılacak.

Sürüm bilgisi: npm'deki güncel sürüm 4.6.5 ve birkaç gün önce yayımlanmış; resmi örnekler import * as z from "zod" biçimini kullanıyor. zod'un TypeScript 7 ile sorunsuz çalıştığını doğrulamadım. Kurulumdan sonraki ilk ölçüm bu yüzden npm run typecheck olacak. 
npm

Gerçek işte: zod sektörde üç yerde standart: API sınırı, form doğrulama ve ortam değişkenlerinin (env) kontrolü. Aynı şema hem sunucuda hem istemcide kullanılabilir. Paket boyutunun kritik olduğu projelerde daha küçük alternatiflere geçilir.