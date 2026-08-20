//                  for döngüsü

// for (let i = 0; i<=100; i++){ //true olduğu sürece çalışır
//     //kodlar
//     console.log(i);
// }
let sayilar = [1, 3, 1, 7, 85, 76, 225, 94, 357];
let toplam = 0;

for (let index = 0; index < sayilar.length; index++) {
  const element = sayilar[index];
  console.log(element);
  toplam += sayilar[index];
}
console.log(`toplam tutar:${toplam}`);

const frameworkList = ["React*", "Vue", "Angular"];

// "frameworkList içindeki her bir "değeri" sırayla 'framework' değişkenine ata"
for (const framework of frameworkList) {
  // map ve dizi ve set gibi sıralı veri yapılarının value'lerinde gezinmeyi sağlar.
  console.log(framework);
}
// Çıktı:
// "React*"
// "Vue"
// "Angular"

const databaseUser = {
  id: 104,
  role: "admin",
  status: "active",
};

// "databaseUser içindeki her bir anahtarı sırayla 'key' değişkenine ata"
for (const key in databaseUser) {
  //Mantığı: Bir yapının içindeki anahtarları (keys / property names) veya indeksleri döndürür. Verinin kendisine değil, o veriyi tutan etikete odaklanır.
  // Değere ulaşmak için objenin anahtarını kullanırız: obje[anahtar]
  console.log(`${key}: ${databaseUser[key]}`);
}
// Çıktı:
// "id: 104"
// "role: admin"
// "status: active"

//Bir dizi aslında arka planda anahtarları sayılardan (0, 1, 2) oluşan bir objedir. Eğer dizide for...in kullanırsan, sana elemanları değil 0, 1, 2 gibi string indeksleri döndürür. Daha da kötüsü, o diziye dışarıdan eklenmiş ekstra metodlar veya özellikler varsa (prototype chain üzerinden), for...in gidip onları da döngüye dahil eder ve kodunu patlatır.
