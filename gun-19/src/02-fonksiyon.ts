// A)
// function fiyatFormatla(fiyat: number): string {
//   if (fiyat === 0) return "0.00 TL";
//   return `${fiyat.toFixed(2)} TL`;
// }


// fiyatFormatla(1299.5);
// fiyatFormatla(0);
// fiyatFormatla("1299") // Argument of type 'string' is not assignable to parameter of type 'number'.

// // B)
// function selamla(isim: string, unvan?: string) { //en son bunu yaptım("Sn." yazdım varsayılana) unvan parametresi stringe kilitlendi.
//     return `Merhaba ${unvan?.toUpperCase()}. ${isim}` // burda kendisi otomatik soru işareti koydu, ilginç.
//// return unvan ? `Merhaba ${unvan} ${isim}` : `Merhaba ${isim}`; // asıl istenen çıktı buydu
//     // kendi koyduğu soru işaretini kaldırınca şu hatayı verdi: 'unvan' is possibly 'undefined'. neyse ki B2 ingilizcem var.
// }

// selamla("Eyüp"); // veri gelmeyebilir anlamındaki soru işaretini kaldırınca 2 argüman bekliyodum 1 tane gönderdin diye hata veriyor
// selamla("Eyüp", "Kıdemli Yazılımcı");

// let kontrol : null = selamla("Eyüp", "Senior Dev.")// Type 'string' is not assignable to type 'null'.


// C)

// function sonSayfa(total: number, limit: number):number {
//     if (limit === 0) return "sıfır"; // :number ekleyince uyarıyı köke çekiyor, yani ilk karşılaşılan yere. önemli, hatanın dışarıda patlamaması için. kaynağında kilitlemek gerek.
//   return Math.ceil(total / limit);
// }
// // let kontrol: null = sonSayfa(24, 10) // tipimiz number
//  let kontrol: number = sonSayfa(24, 10) // stringi numbera atamazsın diyor.



// // D)

// function logla(mesaj: string) {
//   console.log(mesaj);
// }
// const x = logla("test");
// x.length; // voidde length yoktur diyor.
// let kontrol: null = x; // x'in tipi void


// // E)

// const sayilar = [1, 2, 3];
// const katlar = sayilar.map(n => n * 2);

// let kontrol: null = sayilar;  // Type 'number[]' is not assignable to type 'null'.
// // dışarıdan ne idüğü belirsiz parametre alabilen fonksiyon arkadaşımızda tipi kapıda karşılamak gerek, burdaki dizide ise ne olduğu zaten belli. en baştan number[] olarak belirli.
//map'in tarifinde yazıyor ki "sana verilen fonksiyona, dizinin eleman tipinde bir değer göndereceğim". Dizi number[] olduğu için gönderilecek şey number. Sen fonksiyonu yazarken TypeScript zaten kimin ne göndereceğini biliyor.