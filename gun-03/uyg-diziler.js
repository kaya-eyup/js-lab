//                  Uygulama testi


// Kiraz, karpuz, kavun ve erik elemanlarına sahip bir dizi oluştur.

const meyveler = ["kiraz", "karpuz", "kavun", "erik"];

console.log(meyveler)

// dizi kaç elemanlıdır?

let uzunluk = meyveler.length;
console.log(uzunluk);

// dizinin ilk ve son elemanlarını yazdır

let firstOne = meyveler[0]; // 0 indeksli, yani ilk elemanı yazdırır
console.log(firstOne);

let lastOne = meyveler[uzunluk - 1];
console.log(lastOne);


// kavun dizinin bir elemanı mıdır?

let control = meyveler.includes("kavun");
console.log(control);
// çilek elemanını dizinin sonuna ekle

let ekleme = meyveler.push("çilek");
console.log(ekleme);

// dizinin son 2 elemanını sil

let silmek = meyveler.splice(uzunluk - 2, 2, "");
console.log(silmek);




console.log(meyveler);


// aşağıdaki bilgileri bir dizide sakla ve her öğrencinin yaşını ve not ortalamasını hesapla:



  //   { name: "Yiğit", bd: 2010, notlar: [60, 90, 80] },
  // { name: "Ada", bd: 2012, notlar: [70, 80, 80] },
//  { name: "Çınar", bd: 2015, notlar: [60, 50, 80] },
  let yil = 2026;

let ogr1 = ["Yiğit", 2010, [70, 90, 80]];
let ogr2 = ["Ada", 2012, [70, 80, 80]];
let ogr3 = ["Çınar", 2015, [60, 50, 80]];

console.log(yil - ogr1[1]);
console.log(yil - ogr2[1]);
console.log(yil - ogr3[1]);



function ortalamaHesapla(notDizisi) {
   
    const gecersizDegerVarMi = notDizisi.some(not => not < 0 || not > 100 || isNaN(not));   // some değeri bu iş için biçilmiş kaftandır.
    if (gecersizDegerVarMi) {
        throw new Error("Geçersiz değer")
    }
 const toplam = notDizisi.reduce((toplam, sayi) => toplam + sayi, 0);
    const ort = toplam / notDizisi.length;
    return ort;

}



const yigit_not = ortalamaHesapla(ogr1[2]);
const ada_not = ortalamaHesapla(ogr2[2]);
const cinar_not = ortalamaHesapla(ogr3[2]); 

console.log(yigit_not);

console.log(ada_not);
console.log(cinar_not)





