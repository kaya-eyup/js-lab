// //                    Dates and Times

// //aylar 0dan başlar. 0=ocak, 11=aralık

// // get methods
// let simdi = new Date();
// sonuc = simdi;
// sonuc = simdi.getDate(); //gün bilgisi
// sonuc = simdi.getDay();  // 0-6  0:pazar  6:cumartesi
// sonuc = simdi.getFullYear();





// //set methods


// simdi.setFullYear(2026);
// sonuc = simdi;


// let dogumTarihi = new Date(1990, 5, 15)

// sonuc = simdi.getFullYear() - dogumTarihi.getFullYear();

// let milisecond = simdi - dogumTarihi;

// let saniye = milisecond / 1000;
// let dakika = saniye / 60;
// let saat = dakika / 60;
// let gün = saat / 24;
// let yıl = gün / 365;

// sonuc = yıl;

// console.log(sonuc);



const bugun = new Date(); // Senkronize olduğun zaman

// 1. En Basit Hali (Tarayıcı diline veya belirttiğin ülkeye göre)
const kisaTR = new Intl.DateTimeFormat('tr-TR').format(bugun);
console.log(kisaTR); // Çıktı: "13.08.2026"

const kisaUS = new Intl.DateTimeFormat('en-US').format(bugun);
console.log(kisaUS); // Çıktı: "8/13/2026" (Amerikalılar ayı başa yazar)