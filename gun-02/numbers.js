                            // Numbers  //
 
                            
let sonuc;
sonuc = 10;
sonuc = Number("10");
sonuc = parseInt("10.7"); // parse ondalığı siler
sonuc = parseFloat("10.7"); //float güvenli olmayan bir değişken türüdür
sonuc = parseInt("a10");


sonuc = isNaN("a10"); //is not a number?
sonuc = Number.isInteger(10);


let sayi = 10.4599;
sonuc = sayi.toPrecision(5); //toplam 5 basamak ve yuvarlama
sonuc = sayi.toFixed(2); //2 ondalık basamak ve yuvarlama SAYIYI STRİNG DÖNDÜRÜR

sonuc = Math.round(2.6)  // matematiksel yuvarlama Math.ceil yukarı yuvarlar, Math.floor aşağı yuvarlar.
// dökümantasyondan js math diye aratıp kullanabilirsin


sonuc = Math.random() * 10;
sonuc = Math.floor(Math.random() *10) ;


console.log(typeof sonuc);
console.log(sonuc);
