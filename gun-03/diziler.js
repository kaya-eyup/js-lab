//          Diziler
// dizinin temellerini öğrendin.

let urunler = ["Iphone X", "Iphone XS", "Iphone XR"];
let fıyatlar = [10000, 12000, 9000];
let renkler = ["black", "silver", "red"];


let sonuc;

sonuc = `${urunler[0]} ${fıyatlar[0]} ${renkler[1]}`

console.log(sonuc);

let urun1 = [
    "Iphone X",
    10000,
    ["black", "silver", "red"]
]
let sonuc1;
sonuc1 = `${urun1[0]} ${urun1[1]} ${urun1[2][0]}`

console.log(sonuc1);