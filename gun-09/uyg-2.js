const kutu = document.querySelector("#kutu");

// Fonksiyon tanımlarını ölçüm DIŞINDA yapıyoruz
function mesajGoster() {
  console.log("tıklandı",this.textContent);
}

function mesajGoster2(event) {
  if (event.target.tagName === "BUTTON") {
    console.log(event.target.textContent);
    console.log("target:", event.target.textContent);
    console.log(
      "currentTarget:",
      event.currentTarget.id,
    );
  }
}

function testAyriAyri() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 5000; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Eleman ${i + 1}`;
    btn.addEventListener("click", mesajGoster);
    fragment.appendChild(btn);
  }
  kutu.appendChild(fragment);
}
// 1. TEST
//const t0 = performance.now();
testAyriAyri();
//const t1 = performance.now();
//console.log("Ayrı ayrı ekleme süresi:", (t1 - t0).toFixed(2), "ms");

// Kutuyu temizle
kutu.replaceChildren();
 

const t0 = performance.now();

const frag1 = document.createDocumentFragment();
for (let i = 0; i < 5000; i++) {
  const btn = document.createElement("button");
  btn.textContent = `Eleman ${i + 1}`;
  btn.addEventListener("click", mesajGoster); // DEĞİŞKEN: Dinleyici burada ekleniyor
  frag1.appendChild(btn);
}
kutu.appendChild(frag1);

const t1 = performance.now();
console.log("5000 Dinleyici Süresi:", (t1 - t0).toFixed(2), "ms");








 function testDelegation() {
   // 1000 butonu en hızlı şekilde string olarak basıyoruz
   let metin = "";
   for (let i = 0; i < 5000; i++) {
     metin += `<button>Eleman ${i + 1}</button>`;
   }
   kutu.innerHTML = metin;
   kutu.addEventListener("click", mesajGoster2);
 }


// // 2. TEST (Delegation + innerHTML) // arada en az  10 kat fark olacağını zannetmiştim.
//  const t2 = performance.now();
testDelegation();
  kutu.replaceChildren();
//  const t3 = performance.now();
//  console.log("tek kutuda ekleme süresi:", (t3 - t2).toFixed(2), "ms");

const t2 = performance.now();

kutu.addEventListener("click", mesajGoster2); // DEĞİŞKEN: Kutuya 1 kez ekleniyor

const frag2 = document.createDocumentFragment();
for (let i = 0; i < 5000; i++) {
  const btn = document.createElement("button");
  btn.textContent = `Eleman ${i + 1}`;
  // Döngü içinde addEventListener YOK
  frag2.appendChild(btn);    
}
kutu.appendChild(frag2);

const t3 = performance.now();
console.log("1 Dinleyici (Delegation) Süresi:", (t3 - t2).toFixed(2), "ms");


// buton sayısı 1000 gibi düşüük bir sayıda iken tek tek eklemek tek sefere göre neredeyse 2 kat daha hızlı çalışıyor
// 5000 butonda, ayrı ayrı 8ms iken tek kutu 4ms oluyor
// sayıyı 100bine çıkartında tek kutuda ekleme 110ms ayrı ayrı ekleme 160ms oluyor.
const yeni = document.createElement("button");//tek tek eleman oluşutup oluşturma aşamasında onlara eventi ekleyince o event sonradan oluşturulan 5001 numaralı butona doğal olarak gelmiyor çünkü ona tanımlamadık. ama kutuya eveti verip 5001i ekleyince normal butonlar gibi davranıyor çünkü bütün butonlara kutu parentinden geliyor event.
yeni.textContent = "Eleman 5001";
kutu.appendChild(yeni);

// target ile ilgili sabah yazdığımdaki önemli eksiği şimdi öğrendim.

// .target: Olayı başlatan, kullanıcının doğrudan tıkladığı ya da etkileşime girdiği en içteki HTML elemanıdır.

// .currentTarget: Olay kabarcıklanırken (bubbling) yakalayan, yani addEventListener metodunun bizzat tanımlı olduğu kapsayıcı HTML elemanıdır.