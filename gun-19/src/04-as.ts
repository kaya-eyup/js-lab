// 1)

// const yas = "25" as unknown as number;
// console.log(yas + 1);
// console.log(typeof yas);

// export { };

//    // yas.toFixed()
// // şimdilik hata yok.
// // Sen as kelimesini kullandığın an TypeScript kalkanlarını indirir ve sana koşulsuz inanır.

// // çalıştırdığında typeof yas string olur, yas da 251 olur.

// //Editör İhaneti: yas. yazdığımda editör  .toFixed(2) öneriyor, çünkü etiketi number okur. Ancak Node ile çalıştırdığımda TypeError: yas.toFixed is not a function diyerek çöküyor.

// // as verinin kendisini (içeriği) asla dönüştürmez, sadece derleyicinin taktığı gözlüğü (etiketi) değiştirir. İki kez as kullanmak (Double Assertion), TypeScript'in "Burada %100 hata yapıyorsun" uyarılarını susturmak için bilinçli bırakılmış bir arka kapıdır.



// 2)

// const kart = document.createElement("div");
// kart.innerHTML = `<h3>Telefon</h3>`;

// const baslik = kart.querySelector("h3");
//  baslik.textContent = "Tablet";                  //  'baslik' is possibly 'null'.

// export { };

// Tarayıcı simülasyonu (Node.js için)  
const kart = {
  querySelector: (secici: string) => {
    if (secici === "h3") return { textContent: "Telefon" };
    return null; // h4 aradığımızda buraya düşecek
  }
};


// a) Onaylama: "ben biliyorum"
const b1 = kart.querySelector("h3") as HTMLHeadingElement;
b1.textContent = "Tablet";

// // b) Kontrol: derleyiciye ispatla
// const b2 = kart.querySelector("h3");
// if (b2) b2.textContent = "Tablet";

// // c) Ünlem: kısa onaylama
// const b3 = kart.querySelector("h3")!;
// b3.textContent = "Tablet";