OOP (Nesne Yönelimli Programlama), kodu gerçek hayattaki fiziksel nesneler gibi modelleyerek karmaşayı yönetmeyi ve kod tekrarını önlemeyi sağlayan bir mimari yaklaşımdır.
Class (Sınıf) ve Object (Nesne)

Class (Şablon): Bir arabanın fabrikadaki mühendislik çizimidir. Kapı sayısı, renk gibi özellikleri (properties) ve fren yapma, hızlanma gibi yetenekleri (methods) tanımlar.

Object (Örnek/Instance): O çizimden üretilmiş, sokağa çıkmaya hazır fiziksel arabanın ta kendisidir. Tek bir çizimden (Class) binlerce farklı araba (Object) üretilebilir.

OOP'nin 4 Temel Prensibi

1. Encapsulation (Kapsülleme)

Verileri (state) ve bu verileri değiştiren fonksiyonları tek bir bütün içinde toplayıp, dışarıdan doğrudan müdahaleye ve yanlışlıkla bozulmaya kapatmaktır.

Arabanın motorundaki yakıt enjeksiyon mekanizmasının nasıl çalıştığını bilmek zorunda değilsindir; sadece gaza basarsın. İç süreçler gizlenir ve korunur, dışarıdan sadece izin verilen arayüz (gaz pedalı) ile etkileşime girilir.

2. Abstraction (Soyutlama)

Sistemin arka plandaki karmaşık çalışma mantığını gizleyip, geliştiriciye sadece ihtiyacı olan basit kontrolleri sunmaktır.

Kahve makinesinin içindeki su ısıtma, basınç valfleri ve çekirdek öğütme algoritmaları karmaşıktır. Ancak dışarıda sadece "Espresso Yap" butonu vardır. Karmaşıklık soyutlanmıştır.

3. Inheritance (Kalıtım/Miras)

Bir sınıfın, hiyerarşik olarak üstündeki başka bir sınıfın sahip olduğu özellikleri ve metotları devralmasıdır. Kodun tekrar tekrar yazılmasını engeller.

"Taşıt" adında genel bir sınıfın varsa, "Kamyon" sınıfını sıfırdan yazmazsın. Kamyon, Taşıt'ın hareket etme ve motor özelliklerini miras alır; sen üzerine sadece "yük kapasitesi" gibi kamyona has yeni özellikler eklersin.

4. Polymorphism (Çok Biçimlilik)

Aynı isimdeki bir komutun (metodun), farklı nesneler üzerinde çağrıldığında o nesnenin doğasına uygun şekilde farklı sonuçlar üretmesidir.

Sisteme "Hareket Et" komutu gönderdiğinde, bu komutu alan nesne bir Otomobil ise tekerleklerini döndürür, bir Uçak ise pervanelerini çalıştırır. Komut standarttır, ancak icra ediliş biçimi nesneye göre şekil değiştirir.



notlar: 

normal fonksyion "function hesapla()" şeklinde küçük harfle, yapıcı fonksiyon"function Hesapla()" şeklinde büyük harfle yazılır

hoca prototype yazdığında fonksyiona yazıyor, üretilen nesneye değil. metodun bi kere oluşturulup tüm nesneler tarafınan ortaklaşa kullanılması, her nesne üretildiğinde o nesne için aynı metodun kopyasının oluşturulmasından daha optimizedir.

kurucu new ile çağrıldığında this, o çağrıda yeni doğan nesneyi gösterir."

extends, parent classın bütün özellik ve metotlarını childa referans yoluyla bağlar. child.CalculateAge() gibi birşey yazdığında V8 motoru önce bunu child classı içinde arar, bulamaz ise parent classına bağlandığı referans yolu ile çıkıp orda arar
