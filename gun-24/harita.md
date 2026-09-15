Bugünün konuları tek bir sınırın etrafında dönüyor. Bir tarafta TS'in gördüğü dünya var, yani tipler. Diğer tarafta kodun çalıştığı dünya var: tarayıcı, HTML ve derlenmiş JS. Tipler bu ikinci dünyaya ulaşmadan silinir. Bugünkü her araç bu sınırda ya iddia eder ("bana güven") ya da kanıtlar (çalışma anında gerçekten kontrol eder). Hangisinin hangisi olduğunu beş parçada tek tek ölçeceğiz.

1 · DOM tiplemesi (en yüksek öncelik: yarın capstone'u TS'e taşıyacaksın)
Mantık: TS senin HTML dosyanı okumaz. querySelector('#x') dediğinde iki şeyi bilemez: o id'li bir şey sayfada var mı, varsa ne tür bir eleman. Her eleman türünün TS'te ayrı bir tipi var: <input> için HTMLInputElement, <button> için HTMLButtonElement. Özellikler de bu tiplere dağılmış durumda, her özellik her elemanda yok.
Bulacağımız: .value neden derlenmiyor. Üç çözüm (as, tip parametresi, kontrol) olmayan ve yanlış elemanla çalıştırılınca her biri ne yapıyor. Hangisi neden daha iyi.


2 · Erişim belirleyiciler (yarınki HttpError sınıfına bağlanıyor)
Mantık: Bir banka hesabı düşün:
Bakiyeyi dışarıdan kimse yazamasın, sadece sınıfın kendi içi değiştirebilsin.
Ondan türeyen bir vadeli hesap sınıfı bakiyeyi görebilsin, dışarısı göremesin.
Hesap numarası verildikten sonra hiç değişmesin.
Terimler: erişim belirleyici (access modifier):
public: herkes erişebilir
private: sadece sınıfın içi
protected: sınıfın içi ve ondan türeyen sınıflar
readonly: atandıktan sonra kimse değiştiremez
JS'in kendi dilinde de gizli alan var: #balance
Bulacağımız: TS'in private'ı ile JS'in #'ı aynı şey mi? Yasak kod çalışırken de duruyor mu? Kursun gösterdiği kırmızı çizginin ötesi burası.


3 · Parametre özellikleri
Mantık: Bir sınıfta her alan için aynı ismi üç kez yazıyorsun: alan tanımında, constructor parametresinde ve this.owner = owner atamasında. Parametrenin önüne private ya da readonly yazınca TS bu üç işi tek yerde yapar.
Terim: parametre özelliği (parameter property)
Bulacağımız: Uzun ve kısa yazım aynı nesneyi mi üretiyor? Kıdemli katmanda bu kısaltmanın bazı projelerde neden yasaklandığına bakacağız.


4 · Sözleşmeler (düşük öncelik, kesme kuralı buna uygulanır)
Mantık: "Şekil" diye bir nesne yapılmaz, daire ya da kare yapılır. Ama her şeklin alanı hesaplanabilmeli. Bunu söylemenin iki yolu var:
(a) Ortak kod taşıyabilen ama kendisinden doğrudan nesne yapılamayan bir üst sınıf yazarsın.
(b) Hiç kod taşımayan, sadece "şu metotlar olmalı" diyen bir liste yazarsın.
Terimler: (a) soyut sınıf (abstract class), içindeki gövdesiz metot abstract area(). (b) interface; sınıf bu listeye implements ile söz verir.
Bulacağımız: Ne zaman hangisi kullanılır? Hangisi çalışma anında iz bırakır?


5 · Ortam bildirimleri (kısa)
Mantık: HTML'e <script> etiketiyle eklediğin bir kütüphane tarayıcıda global bir değişken bırakır. TS o dosyayı görmediği için "böyle bir şey yok" der. Ona "var, tipi bu, bana güven" demen gerekir. JS ile yazılmış popüler paketler için bu bildirimleri başkaları zaten yazıp paylaşmıştır.
Terimler:
declare: ortam bildirimi, "var, bana güven" demenin yolu
@types/*: başkalarının yazıp paylaştığı bildirim paketleri, örneğin @types/lodash
.d.ts: bu paketlerin içindeki, çalışan kod olmayan, sadece bildirim tutan dosyalar
Bulacağımız: declare ile "var" dediğin şey gerçekte yoksa çalışma anında ne olur?