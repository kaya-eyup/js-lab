import { http } from "./http.js";

// const controller = new AbortController();

// // 50 ms sonra iptal et — istek muhtemelen daha bitmemiş olacak
// setTimeout(() => controller.abort(), 10);

// try {
//   const data = await http("https://countries.dev/name/turkey", {
//     signal: controller.signal,
//   });
//   console.log("veri geldi:", data);
// } catch (error) {
//   console.log("hata adi:", error.name);
//   console.log("hata mesaji:", error.message);
//   console.log("status:", error.status);
// }

// error name kendi ismi olur büyük ihtimalle, ama ismine özel bi status olduğunu hiç düşünmüyorum. 401 404 500 falan bildiğim hata statüleri de buna oturmuyor. undefined veya özel birşey belki.

// hata adi: AbortError
//  hata mesaji: signal is aborted without reason
//  status: undefined




export async function httpWithTimeout(url, ms) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), ms);

  try {
    const data = await http(url, { signal: controller.signal });
    return data;
  } finally {
    // Cevap geldiyse de hata olduysa da sayacı temizle
    clearTimeout(timerId);
  }
}



try {
  // İlk parametre fonksiyon değil, gerçek bir URL string'i olmalı:
  const data = await httpWithTimeout("https://countries.dev/name/turkey", 85);
  console.log("data:", data);
} catch (error) {
  if (error.name === "AbortError") {
    console.warn("Timeout: The request could not be completed within 85 ms and was cancelled.");
  } else {
    console.error("Error:", error.userMessage || error.message);
  }
}

// iki durumu da 85 ms üzerinden görebiliyorum, hata olunca hata mesajını olmaz ise yanıtı döndürüyor sıkıntısız şekilde





// Düz mantık

// Lokantada garsona sipariş verdin. Beş dakika sonra vazgeçtin. İki ihtimal:

// Gün 13'te yaptığın: Yemek geliyor, sen "ben istememiştim" deyip yemiyorsun. Mutfak pişirdi, malzeme gitti, garson taşıdı — sadece sen yemedin.
// Bugün yapacağın: Garsonu çağırıp "siparişi iptal edin" diyorsun. Mutfak pişirmeyi bırakıyor.

// İkincisini yapan şeyin adı iptal denetleyicisi (AbortController). İki parçası var:

// controller → elindeki düğme. controller.abort() dediğinde iptal emri gider.
// controller.signal → o düğmeye bağlı kablo. fetch'e bunu verirsin; fetch kablodan gelen emri dinler.