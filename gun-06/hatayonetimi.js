//                                    hata yönetimi

//              Veriyi kirlet — gerçek hayatta veri hep böyle gelir:

const ogrenciler = [
  { ad: "Ali", notlar: [50, 60, 70] },
  { ad: "Ayşe", notlar: [80, 90, 100] },
  { ad: "Mehmet", notlar: [40, 50, 60] },
  { ad: "Zeynep", notlar: [] },
  { ad: "Can", notlar: null },
  { ad: "Deniz", notlar: [70, "abc", 90] },
];


// function ortalama(notlar) {
//   if (!Array.isArray(notlar)) throw new Error("notlar bir dizi değil");   // "throw" hata fırlatıp call stacki durdurur.
//   if (notlar.length === 0)    throw new Error("not listesi boş");
//   if (notlar != 'number')     throw new Error("not listesinde sayı olmayanlar var.");
  
// }
// ortalama(ogrenciler.notlar);


// (a) çit döngünün DIŞINDA
// try {
//   for (const o of ogrenciler) {}
// } catch (h) { console.log("hata:", h.message); }

// (b) çit döngünün İÇİNDE          // ASIL KULLANACAĞIN BUDUR. 
for (const o of ogrenciler) {
    try {// Aşağıdaki süslü parantezlerin içinde riskli işler dönecek. Gözünü buradan ayırma; en ufak bir hata (throw veya sistem hatası) görürsen akışı durdur ve güvenlik protokolünü devreye sok.
        if (!Array.isArray(o.notlar)) throw new Error("Notlar geçerli bir dizi değil.");
        if (o.notlar.length === 0) throw new Error("Öğrencinin notları girilmemiş.");
        if (o.notlar.some(not => typeof not !== 'number')) throw new Error("Notların içinde sayı olmayan geçersiz bir veri var");
        const toplamNot = o.notlar.reduce((acc, sayi) => acc + sayi, 0)
        const ogrenciOrt = toplamNot / o.notlar.length;
        const durum = ogrenciOrt >= 50 ? "dersi geçmiştir" : "dersten kalmıştır."
        console.log(`${o.ad}, ${durum}`)
  } catch (h) { console.log(o.ad, "atlandı:", h.message); }
}

function dene() {
  try { return "try"; }
  finally { return "finally"; }  // finally demek ne olursa olsun en son bir defa çalış demektir.
}
console.log(dene());   // bir adet finally döndürdü. 