// ========================================
// FETCH API - HTTP İstekleri
// ========================================

// function http(url) {

//   // 1. fetch işlemini doğrudan RETURN ediyoruz (böylece dışarıda .then kullanılabilir)
//     return fetch(url)
//         .then((response) => {
//             if (!response.ok) {   //response.ok fetch sonucunda yanıtın başarılı olup olmadığını değerlendirir, true false döndürür.
//                 throw new Error(`${response.status} ${response.statusText}`);
//             }
//             return response.json();
//         })

// }

// Deneme
// http("https://countries.dev/name/russia")
//   .then(data => console.log("✅", data))
//   .catch(err => console.log("❌", err.message));

// http("https://countries.dev/name/asdasdasd")   // gerçek 404 bekliyoruz
//   .then(data => console.log("✅", data))
//   .catch(err => console.log("❌", err.message));

// http("https://boyle-bir-adres-yok.zzz/")       // ağ hatası bekliyoruz
//   .then(data => console.log("✅", data))
//     .catch(err => console.log("❌", err.message));



// // ters sıra deneyi için:
// function http(url) {
//     return fetch(url).then((response) => {
//         // 1. Önce parse etmeye çalışıyoruz:
//         const parsePromise = response.json();

//         // 2. Kontrol sonraya kaldı:
//         if (!response.ok) {
//             throw new Error(`${response.status} ${response.statusText}`);
//         }

//         return parsePromise;
//     });
// }
// // ters sıra deneyi deneme

// http("https://countries.dev/name/asdasdasd")
//   .then(data => console.log("✅", data))
//   .catch(err => console.log("❌", err.message));

// tahmin: kesinlikle 404 hatasını yakalayamaz o kesin, ancak tam olarak hangi hatayı döndüreceğinden emin değilim. dün buna benzer bi durumda "Country not valid" okumaya kalkışan json.parse onu bi string gibi okuyup unexpected token "C" diye hata vermişti, bi benzeri yaşanacak. // Haklı çıktım.

// // gövdeyi iki kez okuma deneyi:

// fetch("https://countries.dev/name/china")
//   .then((response) => {
//     // 1. Okuma: Gövdeyi ilk kez JSON olarak okumaya başlıyoruz
//     response.json().then((jsonData) => {
//       console.log("birinci okuma başarılı:", jsonData);
//     });

//     // 2. Okuma: AYNI response üzerinden gövdeyi bir de text olarak okumaya çalışıyoruz
//     // response.text() bir Promise döner ve bunu dışarıdaki zincire return ediyoruz
//     return response.text();
//   })
//   .then((textData) => {
//     // Burası ASLA çalışmayacak
//     console.log("ikinci okuma başarılı:", textData);
//   })
//   .catch((err) => {
//     // 2. okuma başarısız olduğu için doğrudan buraya düşecek
//     console.error("hata:");
//     console.error(err.message);
//   });


  // borudan akan su gibi, bardağa boşalınca o su boruda kalmaz. ikinci kez okuyamazsın. görmezden gelir belki ikinci okumayı ya da hata verir.
// //  Failed to execute 'text' on 'Response': body stream already read
  

// // sitenin kök adresi deneyi

// function http(url) {
//     return fetch(url).then((response) => {
//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }

//         const contentType = response.headers.get("content-type");

//         // Gelen yanıt JSON mu diye kontrol et:
//         if (contentType && contentType.includes("application/json")) {
//             return response.json();
//         }

//         // JSON değilse düz metin veya hata olarak ele al:
//         return response.text().then((text) => {
//             throw new Error(`Beklenen JSON yerine farklı tip geldi (${contentType}: ${text.slice(0, 100)})`);
//         });
//     });
// }
// // Deneme

// //  azönceki CORS hatası verip duruyodu o yüzden buna geçtim
// http("https://httpbin.org/html")
//   .then(data => console.log("✅", data))
//   .catch(err => console.log("❌", err.message));

// //response ok true olur çünkü sayfa bulunur ve döndürülür, if kontrolüne girmeden response.jsona geçer. yine jsona string gönderdik, üstteki gibi. aynı durum yaşanır, htmlden okumaya başlayacağı için "<" unexpected token vermeli // haklıymışım, contentType kontrolü ile çökmeyi engelleyip kendi elime aldım.
    

//      HttpError durumu

// 1. Özel Hata Sınıfımız
class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = "HttpError";        // konsolda ve loglarda ayırt edilir
    this.status = response.status;  // çağıran bununla dallanır
    this.url = response.url;        // hangi istek patladı — loglama için
  }
}

// 2. Fetch Fonksiyonumuz
function http(url) {
    return fetch(url).then((response) => {
        if (!response.ok) {
            // Düz Error yerine zengin veriye sahip özel hatamızı fırlatıyoruz:
            throw new HttpError(response);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

        return response.text().then((text) => {
            throw new Error(`Beklenen JSON yerine farklı tip geldi (${contentType}): ${text.slice(0, 100)}`);
        });
    });
}

http("https://countries.dev/name/asdasdasd")
  .catch(err => console.log(err.name, err.status, err instanceof Error));
// → HttpError 404 true