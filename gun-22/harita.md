1. Generic Kısıtlamaları (extends)

Kavram: T'nin rastgele herhangi bir tip olmasını engelleyip, belirli bir kurala (interface/type) uymasını dayatmak.

Senior Bakış Açısı: T'yi tamamen serbest bırakmak kodun derinliklerinde any davranışı sergilemesine yol açar. Tip güvenliği için generic'leri her zaman alabildikleri en dar kapsama sıkıştırmalısın.

Örnek: function longest<T extends length: number { }>(a: T, b: T)

2. Obje Alanlarıyla Dinamik Çalışmak (keyof, T[K], typeof)

typeof: Çalışma zamanındaki (runtime) bir değişkenin statik tip haritasını (kopyasını) derleme zamanına taşır.

keyof T: Bir obje tipinin tüm anahtarlarını union ("id" | "name") olarak döner. Hardcode string kullanımını bitirir.

T[K] (İndeksli Erişim): T objesindeki K anahtarının değer tipini tam olarak yakalar (örn. dönüşün string mi number mı olduğu).

Örnek: function getField<T, K T extends keyof>(obj: T, key: K): T[K]

3. Pick Pattern (İki Tip Parametresi)

Kavram: T (ana obje) ve K (seçilecek anahtarlar - extends keyof T) parametrelerini birleştirerek yeni bir tip üretmek.

Senior Bakış Açısı: Backend'den gelen devasa DTO'ların (Data Transfer Object) içinden, frontend'deki spesifik bir komponentin ihtiyaç duyduğu 2-3 alanı tip güvenli şekilde izole etmek için kritik bir refactoring aracıdır.

Dönüş Tipi: TypeScript'in yerleşik Pick<T, K> utility tipi kullanılır.

4. Result Pattern (Varsayılan Tip Parametreleri)

Kavram: Fonksiyonun ya başarılı bir sonuç (Success) ya da bir hata (Failure) objesi dönmesini sağlayan yapı (Discriminated Union).

Senior Bakış Açısı: Uygulamanın her yerini try/catch bloklarına boğup kontrolsüz throw Error fırlatmak amatörce bir yaklaşımdır. Rust ve Go dillerindeki gibi hataları birer "değer" olarak ele almak, sistemin state'ini (örneğin UI'daki loading/error state'leri) çok daha stabil yönetmeni sağlar.

Örnek: type Result<T, E="string"> = { ok: true, value: T } | { ok: false, error: E };