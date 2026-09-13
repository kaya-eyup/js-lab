export {};
// Önce mantık

// Dün T'yi "her şey olabilir" diye bıraktık. Bunun bedelini fonksiyonun içinde ödedin: TypeScript, T'nin olabileceği her tip için güvenli olmayan hiçbir işleme izin vermez. number de olası bir T olduğu için x.length yazamazsın — sayının uzunluğu yoktur.

// Yani: dışarıda tam serbestlik = içeride tam yoksulluk.

// İş ilanı gibi düşün. "Herkes başvurabilir" dersen başvuran kalabalık olur ama işe alınca eline araba anahtarı veremezsin, ehliyeti var mı bilmiyorsun. "En az B sınıfı ehliyeti olanlar" dersen havuzu daraltırsın, karşılığında bir garanti kazanırsın. Takas budur: çağrı noktasında biraz serbestlikten vazgeç, fonksiyonun içinde yetenek kazan.

// Şimdi terim

// Bu daraltmanın adı kısıt (generic constraint), yazımı <T extends ...>.

// Buradaki extends kelimesi sınıf kalıtımındaki extends değildir — aynı kelime, farklı iş. Burada anlamı "şundan türemiş" değil, "en azından şu şekle sahip". Bunu şimdiden ayır, çünkü aynı dosyada interface A extends B de göreceksin ve o üçüncü bir anlam.



// 1) kısıtsız longest — bilerek hata veriyor
    
    function longest<T>(a: T, b: T): T {
        // uzunluğu büyük olanı döndür
        // @ts-expect-error : Property 'length' does not exist on type 'T'.
        return a.length >= b.length ? a : b; 

}
    
// 2) kısıtlı longest — asıl sürüm
    
    
    // T, "en azından" length özelliği number olan bir yapı olmak zorunda.
function longest2<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// Dönen değer string.
const r1 = longest2("merhaba", "selam"); 

// Dönen değer number[].
const r2 = longest2([1, 2, 3], [1]); 

// Derleme hatası: number'ın length'i yoktur.

// @ts-expect-error sayı tipinde length yok
const r3 = longest2(5, 9);
    
    
// 3) longestPlain — jenerik yerine düz parametre tipi (deney 1)
    
    
    function longestPlain(a: { length: number }, b: { length: number }) {
        return a.length >= b.length ? a : b;
}
    // tahmin: 
const x = longest2("merhaba", "selam").toUpperCase(); // ÇALIŞIR. Çünkü Jenerik (T), fonksiyona giren tipi kaybetmez. Giren string olduğu için, çıkanın da kesin string olduğunu bilir.

// @ts-expect-error Property 'toUpperCase' does not exist on type '{ length: number; }'
const y = longestPlain("merhaba", "selam").toUpperCase();
 // PATLAR.

// derleme sırasında, daha JS'e geçmeden, derleyicinin kendisi bilgiyi kaybediyor. Sen string verdin, imza onu { length: number } kutusuna koydu ve dönüşte o kutuyu geri verdi. Derleyici hâlâ derleme anındadır, sadece elinde artık string yoktur.

// Mantığı: bir kargoyu "kırılabilir eşya" etiketli kutuya koyup teslim ediyorsun. Kutuyu açan kişi içindekinin bardak mı vazo mu olduğunu bilmez — etiket bunu söylemiyor. Bilgi silinmedi, etikete sığmadı.
    
    
// 4) karışık tip çağrısı (deney 2)

// @ts-expect-error : Argument of type 'number[]' is not assignable to parameter of type '"abc"'.
const z = longest2("abc", [1, 2, 3]); 

// // Bir ihaleye üç firma teklif veriyor ve şartname "hepsini birden karşılayan tek bir kategori" istiyor. Değerlendirici ilk teklifi alıp diğerlerini elemez; hepsini toplar, hepsini kapsayan ortak bir üst kategori arar. Böyle bir kategori varsa onu seçer. Yoksa iş çıkmaza girer ve hata verir.
// TypeScript'in T için yaptığı budur: T'nin geçtiği her parametreden bir aday toplar (string ve number[]), sonra bu adayların hepsinin altına sığdığı bir aday var mı diye bakar. Bunun adı en iyi ortak üst tip (best common supertype). string ve number[] arasında böyle bir ilişki yok → çıkarım başarısız → ilk adaya tutunup ikinciyi hata olarak işaretler. Sıra bir sonuç, kural değil.