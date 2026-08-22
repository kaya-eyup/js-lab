function ikiKat(sayi) { 
if(!isFinite(sayi)) return "lütfen sayı giriniz." //koruma
if(sayi === null) return "Lütfen bir değer giriniz."
  return sayi * 2; // asıl işlem



}

console.log(ikiKat(null));


// 2. Girdi bir nesne: { ad, yas }. null ise null dön,
//    değilse aynı nesnenin kopyasını dön ama ad'ı büyük harfle.
function adiBuyut(kisi) {    // KORUMA
  if (kisi === null) return null;
  if (!kisi || typeof kisi.ad !== "string" || typeof kisi.yas !== "number" || !Number.isFinite(kisi.yas)) {
    return "Lütfen geçerli değerler giriniz.";
  }

    
   
    return {
        ...kisi,    // orijinali bozmadan kopyayı döndür.
        ad: kisi.ad.toUpperCase()
    };

}
 
console.log(adiBuyut({ ad: "eyüp", yas: 20 }));



// 3. Girdi bir dizi: [{ad, yas}, ...]. Her elemanı 2. fonksiyondan geçir.

function kisileriBuyut(kisiListesi) {
  // guard clause
  if (!Array.isArray(kisiListesi)) {
    return [];
  }

  // Her elemanı tek tek adiBuyut fonksiyonuna iletir
  return kisiListesi.map(adiBuyut);
}

// Örnek Kullanım:
const kisiler = [
  { ad: "ahmet", yas: 25 },
  null,
  { ad: "mehmet", yas: 30 }
];

console.log(kisileriBuyut(kisiler));

