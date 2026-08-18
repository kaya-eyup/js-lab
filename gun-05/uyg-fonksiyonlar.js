// //        Closure
// function createCounter() {
//   let count = 0;
//   function arttir() {
//     count += 1;
//     return count;

//     function azalt() {
//       count -= 1;
//       return count;

//       function oku() {

//       };
//     }
//   }
// }

// const counter = createCounter();
// console.log(counter()); // 1
// console.log(counter()); // 2
// console.log(counter()); // 3

// //bir fonksiyon içindeki veriye kodun herhangi bir yerinden ulaşılabiliyorsa o veri garbage collector tarafından silinmez. dışarıdaki ulaşılma durumu fonksiyon içinde veriyi garbage collectordan korur

// //          this

// const test = {        //
//   prop: 22,
//   func() {            // fonksiyon, objenin metodu olarak çağırılmış.
//     return this.prop;
//   },
// };

// console.log(test.func()); // noktanın soluna bakar, test fonksiyonu tarafından çağırılmış. onun bağlam alır.

// // this, kodda kim tarafından çağırıldığına göre değişir. farklı objelerin tek bir metodu kullanabilmesini sağlar, her obje için ayrı metoda gerek kalmaz.

// //        Arrow functions, this ile.
// //        normal durumda(obje içinde fonksiyon olarak çağırıldığında) kimin çağırdığına bakıp onu bağlam olarak alırken, ok fonksiyonlarda this bağlamı yoktur, bu yüzden lexical scope'a çıkıp aramaya başlar

// const kullanici = {
//   isim: "Eyüp",

//   lokasyonGetirArrow() {
//     console.log("İşlem başlıyor... İsteyen:", this.isim); // BURASI ÇALIŞIR: "Eyüp"

//     setTimeout(() => {
//       // Arrow function beni kim çağırdı? diye sormaz.
//       // Benim yazıldığım lexical scope (üst katman) neresi? diye sorar.
//       console.log("2 saniye sonra gelen veri kime ait:", this.isim);
//     }, 2000);
//   }
// };

// kullanici.lokasyonGetirArrow();

// // ok fonksiyonu ile yazılan this, yazıldığı yerin lexical scopeına ömür boyu bağlı kalır. thisin alacağı değeri obje içinde bırakıp da, globalde ok+this kodunu yazarsan , globali scope alacağı için (ve orada tanım bulamayacağı için) undefined döner.

// const disScope = () => {console.log("bu satır this metodunun bağlamı olmadığının kanıtıdır." + this.isim) }  // this burada undefined döner.
// disScope();

// //        deneyler

// for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // var yukarı sızmalı. i değişkeninde 3ü de aynı yere bakari son atanan 3 değerine. 3 tane 3 çıkmalı
// //    Sonra aynısını let ile, let blok yarattığı için hafızada tutuluyor değerleri 0 1 2 çıkar(her tur için yeni bir "i" yaratır.). İpucu değil, kural: closure DEĞERİ değil DEĞİŞKENİ yakalar.üç fonksiyon da güncel değere bakar,let yazdığında her i ayrı olarak yaratılır.

// const o = { isim: "Eyüp", selamla: () => this.isim };
// console.log(o.selamla());    // ok fonksiyonunun thisi olmayacağı için globale çıkar ve bulamaz, undefined.

// const g = test.func.bind({ prop: 1 }).bind({ prop: 99 });
// console.log(g()); // bind ile atanan ilk değer, denildiğine göre asla değiştirilemez. 1 çıkmalı

// const a = createCounter(); const b = createCounter(); // a iki defa yazıldığı için 2, b 1 çıkmalı
// console.log(a()); // 1
// console.log(a()); // 2
// console.log(b()); // 1

// const f = test.func; f();   // ESM mi CJS mi sorusunun cevabı burada // bunlar ne anlama geliyor amk, 22 döner galiba
// console.log(f());//   güncelleme;      undefined //   Bir objenin metodunu const f = obj.metod diye başka bir değişkene atarsan, o metod objeyle olan kan bağını anında kaybeder. bağ kaybolduğu için this bağlamı da kopar.

//   setTimeout(test.func, 0);
//   [1, 2].map(test.func);
//   test.addEventListener("click", test.func);

// console.log()

function kasaOlustur() {
  let count = 0;
  return {
    arttir() {
      count += 1;
      return count;
    },
    azalt() {
      count -= 1;
      return count;
    },
    sifirla() {
      count = 0;
      return count; //sifirla'yı nesneye koymasaydın, count'u sıfırlamanın başka bir yolu kalır mıydı? 
      //güzel soru. closureyi geçmek gerekiyor değiştirmek için. ve  mevcut durumda geçilemez olabilir,zira ilkel veri tiplerinde değerin kopyası aktarılırken referance tiplerde bellek adresi aktarılıyor. bellek adresini bildiğin şeyi manipüle edebilirsin, ucuz bi kopyayı değil. closure da değeri değil referansı yakalar :D 
    },
    oku() {
      return count;
    },
  };
}

const firsttry = kasaOlustur();
console.log(firsttry.arttir());
console.log(firsttry.arttir());
console.log(firsttry.arttir());
console.log(firsttry.azalt());
console.log(firsttry.azalt());
console.log(firsttry.arttir());
console.log(firsttry.oku());
console.log(firsttry.sifirla());

const secondtry = kasaOlustur();
console.log(secondtry.azalt());
console.log(secondtry.azalt());
console.log(secondtry.azalt());
console.log(secondtry.sifirla());

const sayac = kasaOlustur();
sayac.count = 999;
console.log(sayac.oku()); // dışarıdan değiştirilemez. 0 çıkar.
//console.log(sayac.count()); // count bir değişken değil mi aq, hata vermesi gerekiyor.
 // typeError ve referenceError, call stacki kilitler.

const nesne = {
  ad: "js-lab",
  raporla() { return this.ad; }
};
nesne.raporla = once(nesne.raporla);
console.log(nesne.raporla());   // js-lab çıkar, this doğru kullanılmış


function once(fn) {
  // hafıza değişken(ler)i burada
  let kullanildiMi = false; //ilk kullanım için false atıyoruz ki aşağıdaki if bloğuna girebilsin
  return function (...args) {
    if (!kullanildiMi) {
    kullanildiMi = true; // İlk kullanımda kapıyı kilitledik
    return fn.apply(this, args); }  // bu satır sabahki "sar" kalıbı
  };
}



const topla = once((a, b) => a + b);
console.log(topla(2, 3));   // 5
console.log(topla(9, 9));   // ne çıkmalı? tahmin yaz // undefined döndürmesi gerekmiyor mu? tek kullanımlık şeyi ikinci defa kullanamazsın. // 18 döndürdü, ilginç. yukarıda yazılan 



//                      call, apply, bind ve this ile uygulamalar. bu konuyu tam anlamamıştım, tekrar etmeliyim.
const rota1 = { isim: "Likya Yolu", zorluk: "Zor" };
const rota2 = { isim: "Efes Antik Kenti", zorluk: "Kolay" };

// Bağımsız Taşeron İşçi
function rehberAta(rehberAdi, sure) {
  // Bu fonksiyon this'in kim olacağını şu an bilmiyor.
  console.log(`[${this.zorluk}] ${this.isim} rotasına ${rehberAdi} rehberi ${sure} günlüğüne atandı.`);
}

rehberAta("Eyüp Kaya", "3"); // undefined gelir çünkü fonksiyon, içinde this değerini barındıran bağlam(rota1) olmadan çağırılmış
rehberAta.call(rota1, "Ahmet", "1");  // call mantığı: İşçiyi çağırıyorsun. Elindeki yaka kartını (this objesi) zorla boynuna takıyorsun, eline de yapacağı işin parametrelerini tek tek (virgülle) verip "Hemen şimdi çalış!" diyorsun. Motor o saniye fonksiyonu çalıştırıp işi bitirir.


const veritabaniGelenVeri = ["Ahmet", 3]; // Veri paket halinde geldi

// 1. Parametre: This'in kim olacağı (rota2)
// 2. Parametre: Veri paketi (Array)
rehberAta.apply(rota2, veritabaniGelenVeri); // apply mantığı: call ile tamamen aynıdır. Anında çalıştırır ve yaka kartını takar. Tek bir mimari farkı vardır: Parametreleri virgülle tek tek vermek yerine, bir kutunun (Dizinin/Array) içinde paket halinde verirsin.



//Sadece this'in rota1 olduğu zırhlı bir KLON üretir. 
const likyaIcinRehberAta = rehberAta.bind(rota1); // bağlamak anlamına gelir,

// Sen ne zaman istersen, o klonu normal bir fonksiyon gibi çağırırsın.
likyaIcinRehberAta("Mehmet", 14);  // aralarında en çok kullanacağın metod, bind
 
