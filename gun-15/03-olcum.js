import { getCountry } from "./01-async-await.js";






const names = ["turkey", "japan", "brazil", "canada", "france",
    "germany", "russia", "italy", "mexico", "norway"];
               

const badNames = [...names.slice(0, 5), "asdasdasd", ...names.slice(6)];

//  async function fetchSequential(par) {
//    const start = performance.now();
//    const results = [];
//    for (const name of par) {
//      const country = await getCountry(name);
//      results.push(country);
//    }
//    return { ms: performance.now() - start, count: results.length };
//  }
//  console.log(fetchSequential(names))
//  // ortalama 850 ms.


//  async function fetchParallel(par) {
//    const start = performance.now();
//    // 1. await YOK: 10 isteğin hepsi aynı anda network'e fırlatılıyor
//    const promises = par.map((name) => getCountry(name));
//    // 2. Promise.all hepsinin bitmesini aynı anda bekliyor
//    const results = await Promise.all(promises);
//    return { ms: performance.now() - start, count: results.length };
// }

// const parallelResult = await fetchParallel(names);

// console.log("Parallel result:", parallelResult); // fark tam 10 kat olmaz, 5 6 kat olur çünkü daha önce de böyle şeyler denedik, %100 orantılı değil bu işlemler, arkaplanda başka şeyler de dönüyor hesaba katmadıklarımız oluyor(tam bilmiyorum) 100-200 ms arası ortalama. tek tek ile fark yaklaşık 5-6 kat. tahminim cuk oturdu.
// //  const parallelResult = await fetchParallel(badNames); // Promise.All diyorsa mantıken biri çökünce hepsi çökmeli, kelimeden çıkarım yaptım.
//  Promise.all başarısızlıkta diğer istekleri iptal etmez. İlk hata gelir gelmez sana hatayı fırlatır, ama kalan 9 istek yoluna devam eder, sunucuya gider, cevapları döner ve çöpe atılır. Yani "hepsi çöktü" değil, "hepsinin sonucunu görmekten vazgeçtin".

  
//  // immune to errors:
//  async function fetchParallelSettled(countryList) {
//    const start = performance.now();
//    const promises = countryList.map((name) => getCountry(name));
//    const results = await Promise.allSettled(promises);
//    return { 
//      ms: performance.now() - start, 
//      results 
//    };
//  }
//  const settledresult = await fetchParallelSettled(badNames);
//  console.log(settledresult); // hatalı elemanı dizinin bi elemanıymış gibi orada görebiliyorsun. çökertmeden ayıklama yapabilirsin
// // Ayıklama mantığı:

// const basarili = settledresult.results
//   .filter((r) => r.status === "fulfilled")
//   .map((r) => r.value);

// const basarisiz = settledresult.results
//   .filter((r) => r.status === "rejected")
//     .map((r) => r.reason);
  
//    console.log(`${basarili.length} başarılı geldi, ${basarisiz.length} patladı.`);
// console.log("Patlayan isteğin HTTP kodu:", basarisiz[0].status);
// console.log("Patlayan isteğin mesajı:", basarisiz[0].message);