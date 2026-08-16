
const siparis = {
  id: 1,
  musteri: {
    ad: "Ayşe",
    adres: { sehir: "İzmir", ilce: "Bornova" },
  },
  urunler: [
    { ad: "Klavye", fiyat: 1250, adet: 1 },
    { ad: "Mouse", fiyat: 450, adet: 2 },
  ],
  indirim: 0,
  not: "",
};




// const kopya = { ...siparis } yap. kopya.id = 999 → orijinal ne oldu? Sonra kopya.musteri.adres.sehir = "Ankara" → orijinal ne oldu? Bu sonucu log'a "şaşırtan sonuç" olarak yaz, çünkü React'teki en sık bug'ı az önce ürettin.

// const kopya = { ...siparis }
// kopya.id = 999;
// console.log(siparis);                //Spread değerleri kopyalar; nesnelerde değer, adrestir. Bu yüzden sadece en üst katman gerçekten kopyalanır.
// console.log(kopya)

// kopya.musteri.adres.sehir = "Ankara";
// console.log(kopya);                         // madem yeni adrese kaydediyor kopya değeri, neden orijinali de değiştirdi?spread belirtilen dizinin sadece ilk alt katmanını kopyalıyor, bununla bir ilgisi olabilir mi, yoksa sadece bir bug mı?. Log'a not al bu detayı.





// sehiri, orijinali bozmadan değiştiren bir kopya üret. Spread'i iç içe kullanman gerekecek. Kaç katman yazdığını say — bu sayı, ilerideki bir kütüphanenin (Immer) var olma sebebi.

// const yeniKonum = { ...siparis, musteri: { ...siparis.musteri, adres: {...siparis.musteri.adres, sehir: "Antalya", ilce:"Konyaalti"}} };
// // console.log()
// console.log(yeniKonum);


//structuredClone ile daha kolay yapılabilir:

// const yeniBolge = structuredClone(siparis);
// yeniBolge.musteri.adres.sehir= "İstanbul" //burada ilceyi de değiştirmek için bir daha yazmak hamallık gibi, daha iyi bir yolu olmalı.
// console.log(yeniBolge)





// Object.freeze(siparis) çağır, sonra siparis.musteri.adı değiştirmeyi dene. Ne oldu? Neden?

// Object.freeze(siparis);


// const yeniAd = structuredClone(siparis); yeniAd.musteri.ad = "Ahmet";   // spread ile dene.

// const yeniAd = { ...siparis, musteri: { ...siparis.musteri, ad: "Ali" } };
// console.log(yeniAd);


// bunun spread operatörünün kapsamı (hedef dizideki ilk alt katman) ile bir alakası olabilir. daha yüzeysel bir eleman ile deneyelim:



// const yeniNot = structuredClone(siparis);

// Object.freeze(yeniNot);

// yeniNot.not = "Alışverişiniz için teşekkür ederiz.";

// console.log(yeniNot);
//aynen öyle imiş. object.freeze hedef dizinin elemanlarını donduruyor sadece, içinde bi dizi daha varsa nüfus edemiyor. lakin hata vermesini bekliyordum ama vermedi, sadece bi satır sonra gelen komutu görünmez kılmakla yetindi.

 



// Kendi deepClone(nesne) fonksiyonunu yaz. Object.entries + kendi kendini çağırma işini görecek. Diziler ve null için ayrı davranman gerekecek — typeof null neydi, gün 1'den hatırla.

// ben fonksiyon yazmayı bilmiyorum ki amk. ilerinin konusu değil miydi bu? soru sorarken bunu göz önünde bulundur.

// deepClone'unu şununla patlat: const x = {}; x.kendisi = x; Neden patladı, tek cümleyle yaz.

const x = {}; 
x.kendisi = x;
const deepClone=x;
console.log(deepClone);

// structuredClone(siparis) dene. 5'teki durumda ne yapıyor? Neyi klonlayamaz (fonksiyon koyup dene)?

// bilgim yok.


// Şu ikisini karşılaştır ve doğru olanı seç: siparis.indirim || 10 ile siparis.indirim ?? 10. Aynısını not alanıyla tekrarla.

siparis.indirim || 10  //  Sonuç 10 döner. Neden? Çünkü || (OR) operatörü 0 sayısını "yanlış/boş" (falsy) kabul eder ve sağdakine geçer.

siparis.indirim ?? 10 // Sonuç 0 döner. (DOĞRU OLAN) Neden? Çünkü ?? (Nullish) operatörü sadece null veya undefined görürse sağdakine geçer.


// siparis.musteri.telefon diye bir alan yok. ?. ve ?? birlikte kullanarak "telefon yoksa "kayıtlı değil" " çıktısı üret.

const telefonBilgisi = siparis.musteri?.telefon ?? "kayıtlı değil";
console.log(telefonBilgisi); 


// Kapanış: urunler dizisinden Object.entries/reduce ile { Klavye: 1250, Mouse: 900 } şeklinde bir toplam-fiyat nesnesi çıkar. Dünkü reduce boşluğu burada kapanacak — akümülatörün başlangıç değerini {} vermen gerekecek, sebebini bugün sabah konuşmuştuk.
const toplamFiyatlar = siparis.urunler.reduce((kasa, urun) => {
  // Kasanın içine ürünün adını key olarak açıyoruz ve fiyat hesaplamasını value olarak atıyoruz.
  kasa[urun.ad] = urun.fiyat * urun.adet; 
  return kasa;
}, {}); 

console.log(toplamFiyatlar); 
