//                  nesneler (objects)

// köşeli parantez dizi, süslü parantez object oluşturur.
// iki farklı diziyi bir üst diziye ekle

// let kullanici = ["Eyüp", "Kaya", 20];


let kullanici1 = {
    ad: "Eyüp",
    soyad: "Kaya",
    yas: 20,
    adres: {
        ulke: "Türkiye",
        sehir: "Antalya",
        ilce: "Konyaalti",
    }
};
let sonuc;

// sonuc = kullanici1.ad;
sonuc = kullanici1.adres.sehir;

console.log(sonuc);