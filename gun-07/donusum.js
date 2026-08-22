const kisiler = [
  { ad: "ali",  yas: 17, puan: 40 },
  { ad: "veli", yas: 22, puan: 75 },
  { ad: "ayşe", yas: 30, puan: 90 },
];



// 1. sadece isimler                        → ["ali", "veli", "ayşe"]
const isimler = kisiler.map(kisi => kisi.ad);
console.log(isimler);

// 2. 18 yaş ve üstü olanlar                → [veli, ayşe nesneleri]
const buyukler = kisiler.filter(kisi => kisi.yas > 18);
console.log(buyukler);
// 3. puanların toplamı                     → 205
function hesapla(notDizisi){
  return     notDizisi.reduce((acc, kisi) => acc + kisi.puan, 0);
   
}

 
const toplamNot = hesapla(kisiler);
console.log(toplamNot)


// 4. isimler büyük harfle                  → ["ALİ", "VELİ", "AYŞE"]

function buyukHarf(isimgir) {
    
  return isimgir.toLocaleUpperCase("tr-TR");



}
// isimler değişkenini yukarıda zaten tanımlamıştık

const buyukAdlar = isimler.map(buyukHarf);
console.log(buyukAdlar);


// 5. puanı 50'den büyük olanların ADLARI   → ["veli", "ayşe"]

const adultNotes = kisiler.filter(kisi => kisi.puan > 50).map(kisi => kisi.ad)
console.log(adultNotes);

// 6. en yüksek puan                       // math.max()

function enYuksek(girdi) {
    
    return Math.max(...girdi); // virgül ile ayrılmış sayılar bekler, ...girdi ile yapabilirsin.

}

const iyiPuan = enYuksek(kisiler.map(kisi => kisi.puan));
console.log(iyiPuan);