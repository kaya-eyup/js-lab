 import { http } from "./http.js";
 // HttpError zaten http içinde var.


 // getCountry sadece veri getirmekle yükümlü bir işçidir.
export async function getCountry(name) {
    
    return http(`https://countries.dev/name/${name}`);
    
    
}
// // Çağıran katman: Karar verme yetkisi olan yer
export  async function renderCountryScreen(countryName) {
  try {
    const data = await getCountry(countryName);
    console.log(data);
  } catch (error) {
    // Hata yutulmadı.
    // Sınıfımıza eklediğimiz userMessage'ı veya status dallanmasını burada kullanıyoruz:
    if (error.status === 404) {
      console.warn("Kullanıcı Bildirimi: Aradığınız ülke haritada bulunamadı.");
    } else if (error.status >= 500) {
      console.error("Kullanıcı Bildirimi: Ülke servisi çöktü, mühendisimiz Eyüp Kaya ilgileniyor.");
    } else {
      // Ağ kopması, internet yokluğu (error.status undefined olur)
      console.error("Kullanıcı Bildirimi: İnternet bağlantınızı kontrol edin.");
      }
   
    }
    return countryName
}
// const data = await renderCountryScreen("turkey");
// console.log(data); 

//  const data2 = await renderCountryScreen("asdasd");
//  console.log(data2);

// // // iki ülke çekmek:
// async function getTwoCountries(name1, name2) {
//   // 1. istek başlar ve bitene kadar alt satıra ASLA geçmez
//   const c1 = await getCountry(name1);
  
//   // 1. istek bittikten sonra 2. istek başlar
//   const c2 = await getCountry(name2);

//     return { c1, c2 } ;
// }



// const result1 = await getTwoCountries("russia", "turkey");
// console.log(result1)
// // ikisini birden getirdi, yukarda returnu obje ile döndürmeyince ikincisini çalıştırıyor sadece

// const result2 = renderCountryScreen("turkey");
// console.log(result2);
// // herhalde normal döner
// // prommise pending döndü. burayı açıkla.


// // Fonksiyonun başında async olduğu için renderCountryScreen her zaman bir Promise (kutu) döndürür.  Sen başına await koymadığın için, JavaScript ağ isteğinin tamamlanmasını beklemeden o satırı anında çalıştırır.  O anda kutunun içi henüz dolmadığı için konsola kutunun o anki durumu basılır: Promise { <pending> } (Beklemede).Kutunun içindeki sonuca (bu senaryoda undefined'a) ulaşmak için başına await koymak şarttır.  