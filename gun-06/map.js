//              map,            objenin abisi

//      Map yapısı her tür veriyi (fonksiyon, nesne, sayı) anahtar olarak kabul eder, sıralı yapıdır. (iterable)
//  Object yapısını ise anahtarları sadece metin (string) veya sembole (symbol) çevirir sıralı yapı değildir. 

const talebeler = { id: 12, isim: "Eyüp", soyisim: "Kaya" };
console.log(talebeler);



const ogrenciler = new Map();

ogrenciler.set(1, "Ali Kaya");  // map içine entry ekler.
ogrenciler.set(12012012012, "Eyüp Kaya");
ogrenciler.set(false, "Ahmet Kaya");
ogrenciler.set(2,); // girilen key'in valuesi olmayabilir.

let sonuc = ogrenciler.size; // map'in güncel uzunluğunu verir, 4 adet entrye sahip şuan.
console.log(sonuc)

ogrenciler.delete(1); 
console.log(ogrenciler);

let varMi = ogrenciler.has(2); // bir keyin mapte tanımlanıp tanımlanmadığına bakar, boolean döndürür.
console.log(varMi);
console.log(ogrenciler.get(12012012012)); // get metodu ile keyi girilen valueyi döndürebilirsin
console.log(ogrenciler.get(false)); 

//ogrenciler.clear();// bütün elemanları siler.
// console.log(ogrenciler);

// for (let x of ogrenciler.keys()) { 
//     console.log(x);
// }
// for (let y of ogrenciler.values()) {
//     console.log(y);
// }

// for (let z of ogrenciler.entries()) {
//     console.log(z);
// }

for (let [key, value] of ogrenciler.entries()) {
    console.log([key, value]);
}