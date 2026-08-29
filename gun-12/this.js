//0.1
function Urun(ad) { this.ad = ad; }
const a = new Urun("Kalem");
const b = new Urun("Defter");
console.log(a.ad)   // → ?  (tahmin) // kalem gelmeli çünkü kurucunun içindeki this her zaman o çağrıda doğan elemanı döndürür


// // //0.2

 const c = Urun("Bardak");
 console.log(c);       // → ? // new yazmaz isen ürün oluşturamaz ki. undefined.ad arayacak ve bulamayacak, hata verdi. direkt script ile yazınca da undefined döndü


// 0.2 açıklaması:
//new kullanmadığın an Urun("Bardak") sıradan bir fonksiyona dönüştü.

// new olmadığı için içerideki this bağlamı boşta kaldı. JavaScript'in eski ve kötü tasarımından (Implicit Binding) dolayı, boşta kalan this her zaman en tepedeki Global Objeye (tarayıcıda window, Node.js'te global) bağlanır.

// Sen this.ad = "Bardak" dediğini sanırken, aslında kod gidip gizlice window.ad = "Bardak" atamasını yaptı. yani globali kirlettin.


// Normal <script> (Gevşek Mod / Sloppy Mode)
// Normal script etiketiyle bağladığında JavaScript varsayılan olarak gevşek modda çalışır ve this referansı boşta kalınca global window objesine yapışır. Bu yüzden kod hata fırlatmak yerine tarayıcının global hafızasını kirletir ve fonksiyon geriye sessizce undefined döner.

// <script type="module"> (Katı Mod / Strict Mode)
// Modül mimarisi arka planda her zaman katı mod ("use strict") ile çalışarak this referansının global objeye kaçmasını engeller ve onu undefined olarak tutar. Sen içi boş (undefined) olan bu referansa değer atamaya çalıştığında ise motor anında TypeError fırlatarak sistemi güvenceye alır.


 function urun(ad) { this.ad = ad; }   // küçük harf
const d = new urun("Silgi");
console.log(d.ad);   // → ?  silgi döner, o büyük harf adlandırması kural değil tercih.