1. Ne Bu ve Nasıl Çalıştırılır?
Bu proje; DummyJSON API'sinden çektiği ürünleri arama, sayfalama, detay görüntüleme ve 404 sayfası desteğiyle listeleyen, istemci taraflı (client-side) bir e-ticaret katalog uygulamasıdır. Dış bir framework kullanmadan kimlik tabanlı uzlaştırma (identity-based reconciliation), merkezi state ve SPA yönlendirmesinin perde arkasını deneyimlemek için saf (Vanilla) JavaScript ile yazılmıştır. Herhangi bir harici framework kullanılmadan modern frontend mimarisinin temelleri atılmıştır. 

Bash
npm install
npm run dev
2. Mimari ve Dosya Sorumlulukları
index.html: Uygulamanın ana kabuğu ve dinamik içeriklerin yerleşeceği #app taşıyıcısı.

main.js: Uygulama giriş noktası, olay dinleyicileri ve yönlendirici (router) başlatıcısı.

store.js: Sistemin tek gerçeklik kaynağı (Single Source of Truth) ve durum yöneticisi.

router.js: Sayfa yenilenmesini engelleyen, pushState/popstate tabanlı SPA yönlendiricisi.

actions.js: Asenkron iş akışlarını, veri çekme eylemlerini ve iptal (abort) sinyallerini yönetir.

render.js: State güncellendiğinde ilgili görünümleri çağıran ve ekranı hazırlayan şantiye şefi.

views/listView.js, views/detailView.js, views/notFoundView.js: State'i okuyarak ekrana basılacak HTML şablonlarını döndüren görünüm (view) fonksiyonları.

lib/updateList.js: Ekrandaki fiziksel düğümleri data-id ile eşleştirip yerinde yamayan kimlik tabanlı DOM uzlaştırma (reconciliation) motoru.

api/products.js: Sunucu verisini arayüzün beklediği formata (DTO) çeviren ağ katmanı.

lib/http.js: Fetch API'yi sarmalayan ve hataları HttpError sınıfıyla standartlaştıran yapıcı.

lib/deepFreeze.js: State nesnesinin dışarıdan mutasyona uğramasını engelleyen özyinelemeli kalkan.

lib/debounce.js: Hızlı klavye girdilerinde API isteklerini frenleyen zamanlayıcı.

lib/escapeHtml.js: Zararlı XSS saldırılarına karşı kullanıcı girdilerini temizleyen güvenlik filtresi.

3. Verdiğim Kararlar

Bedel: Geliştirme aşamasında performans maliyeti; karşılığında gizli yan etkilerin ve hatalı render süreçlerinin engellenmesi.

Karar: Havadaki istekler için AbortController kullanmak.

Alternatif: Yalnızca debounce ile yetinmek.

Bedel: Kod karmaşası; karşılığında eski isteklerin geç gelip yeni ekranı ezmesinin (Race condition) kesin olarak çözülmesi.

Karar: innerHTML yerine Map ve data-id tabanlı kimlik uzlaştırması.

Alternatif: Ekranı tamamen silip baştan çizmek.

Bedel: Karmaşık bir DOM taşıma algoritması yazmak; karşılığında form inputlarındaki değerlerin ve tarayıcı odağının korunması.

Karar: DTO (Data Transfer Object) adaptörü kullanmak.

Alternatif: API JSON yanıtını doğrudan arayüze basmak.

Bedel: Ekstra bir dosya/fonksiyon katmanı; karşılığında backend yapısı değiştiğinde arayüz bileşenlerinin kırılmaması.

Karar: deepFreeze korumasını yalnızca geliştirme ortamıyla (dev) sınırlamak.

Alternatif: Üretim ortamında da sürekli çalıştırmak.

Bedel: Canlıda kaza eseri mutasyon yaşanma ihtimali; karşılığında son kullanıcı için gereksiz özyinelemeli (recursive) CPU maliyetinden kurtulmak.

4. Bu Mimarinin Canımı Yaktığı Yerler
Yeni bir alan ekleme maliyeti ve sessiz hatalar: Ürün modeline "derecelendirme (rating)" gibi tek bir değişken eklemek istediğimde üç dosyaya dokunmam gerekiyor: api/products.js (DTO), views/listView.js (kartın ilk kurulduğu yer) ve lib/updateList.js (kartın güncellendiği yer). İşin en tehlikeli yanı; alanı listView'e ekleyip updateList'te unutursam, veri ilk çizimde doğru görünür, ancak güncellemede eski değerinde donup kalır. Çalışıyor gibi görünüp sessizce yanlış veri gösteren en sinsi hata türü.

Kırılgan DOM Seçicileri: Etiket isimleri ve sınıflar (örn. h3, .card) doğrudan JavaScript içinde sabit (hardcoded) yazıldığı için, HTML tarafında yapılacak ufak bir stil veya etiket değişikliğinde uygulamanın sessizce çökme potansiyeli çok yüksek.

İşlemci İsrafı: State içindeki veriler öncekiyle birebir aynı olsa dahi, state her set edildiğinde updateList.js döngüsü çalışıp aynı metinleri DOM düğümlerine tekrar atıyor. Gerçek düğümleri kontrol ederken araya giren bir koruma katmanı yok.

5. Bilinçli Borçlar
Pager mantığı iki yerde parçalı duruyor (listView ve render) — birini değiştirirsem diğeri sessizce eski kalmaya mahkum.

.status, .meta ve .cards sınıf adları iki dosya arasında oku olmayan, son derece kırılgan bir bağ (coupling) yaratıyor.

updateList motoru yalnızca .cards sınıfı için çalışıyor, uygulamanın geneline hizmet edecek şekilde soyutlanamadı.

Store'da yeniden giriş (reentrancy) koruması yok; setState döngüsü içinde yeni bir setState çağrılmasını engelleyen teknik bir kilit yerine sadece iyi niyete dayalı yazılı olmayan bir kural var.

Gereksiz çizim engellenmiyor (bail-out yok); state verisi hiç değişmese bile render döngüsü baştan sona tetikleniyor.

Store abonelerinde oluşabilecek hatalar izole edilmiyor (try/catch sarmalı yok); abonelerden biri hata fırlatırsa tüm render zinciri çökebilir.

URL parametrelerinin güvenliği için encodeURIComponent(id) sanitizasyonu eklenmedi.

Projede kod standartlarını ve olası hataları denetleyecek bir ESLint yapılandırması kurulmadı.

Geçmiş çalışmalardan devreden 05-retry.js, 04-kompozisyon.js dosyaları ve Gün 13 temizlik borcu henüz eritilmedi.

6. Bir Daha Yazsam
Çalışma zamanı (runtime) hatalarıyla boğuşmak yerine en başından TypeScript kurgusuyla başlar, container.children gibi yazılımsal yazım hatalarını kodu çalıştırdıktan sonra değil, yazarken editörde yakalardım.

State güncellemelerinde yeni veri eskisinin birebir aynısıysa render sürecini tamamen durduracak basit bir erken çıkış (Object.is tabanlı bail-out) kontrolü eklerdim.

React kullanırdım — ama artık hangi problemi çözdüğünü bildiğim için kullanırdım, kolay olduğu için değil.