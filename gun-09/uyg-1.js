 const elemanlar = document.querySelector("#list");




//                                          yöntem A = her turda ağacı güncellemek

// function besbinkereyazdirA() {
//     for (let i = 0; i < 5000; i++) {
    
//     const li = document.createElement("li");
//     li.textContent = `eleman ${i + 1}`;
//     elemanlar.appendChild(li); // döngü bitene kadar çıkardığı her elemanı sırasıyla ekledim.
   

   
  
//     }
// }
// besbinkereyazdirA();  // 8-13 ms arasında tamamlıyor



//                                yöntem B = bir değişkende çıkan değerleri biriktirip döngü bitince ekrana yazdır

const t0 = performance.now()

 function besbinkereyazdirB() {
     let metin = "";  // başlangıç değeri atadık (boş string)
     for (let i = 0; i < 5000; i++) {

        //   const li = document.createElement("li");
         metin += `<li>Eleman ${i + 1}</li>` // Sadece string'e ekleme yap
      
 
     }
     elemanlar.innerHTML = metin   // 2. Döngü bittiğinde tek seferde DOM'a aktar
 }
 besbinkereyazdirB();  // 3-5 ms arasında tamamlanıyor   //       EN HIZLISI



const t1 = performance.now();

 console.log("Süre:", (t1 - t0).toFixed(2), "ms"); // t0'dan kronometre başladı, t1'e kadar olan zamanı tuttu. 






//                                yöntem C = geçici taşıma kabına atıp işlem bitince onu ekrana yazdırmak
 

//  function besbinkereyazdirC() {
//      const kap = document.createDocumentFragment(); // döngünün dışında bi kap oluşturdun
//      for (let i = 0; i < 5000; i++) {
  
//      const li = document.createElement("li");
//      li.textContent = `eleman ${i + 1}`;
//      kap.appendChild(li); // döngü bitene kadar çıkardığı her elemanı sırasıyla kap'a attın.
 
 

//      }
//      elemanlar.appendChild(kap); // döngü bittikten sonra kap'ta biriken herşeyi elemanlar değişkenine attın.
//  }
//   besbinkereyazdirC();  // 5-7 ms arasında tamamlıyor

//                      yöntem A2
// function besbinkereyazdirA2() {
//     for (let i = 0; i < 5000; i++) {
        
//     const li = document.createElement("li");
//     li.textContent = `eleman ${i + 1}`;
//     elemanlar.appendChild(li); // döngü bitene kadar çıkardığı her elemanı sırasıyla ekledim.
//     elemanlar.offsetHeight;   // hiçbir şey yapmıyor gibi görünen bir okuma
        
//         //araştırdım. tarayıcı şöyle der : Bana az önce yeni bir eleman ekledin ama ben henüz sayfa düzenini hesaplamaamıştım. Şimdi benden kesin yükseklik istiyorsun. İşi gücü bırakıp kuyruktaki tüm değişiklikleri hemen şimdi hesaplamam şart."

//         //Döngü 5000 kez döndüğünde tarayıcı 5000 kez sıfırdan tüm sayfa düzenini ve eleman boyutlarını baştan hesaplamak zorunda kalır.

   

//     }
// }
// besbinkereyazdirA2();  // ? 5000 ms oldu, neden?

 
