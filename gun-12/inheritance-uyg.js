 class Urun{

    #adet;
    static olusturulan = 0;
    constructor(ad, fiyat, adet) {
        this.ad = ad;
        this.fiyat = fiyat;
        this.adet = adet;    
        Urun.olusturulan++;
     }
     
     static karsilastir(urunA, urunB) {
        return (urunA.fiyat - urunB.fiyat)
    }
    fiyatYazdir() {
        return this.toplam;
    }
    get toplam() {
        return this.fiyat * this.adet;
    }
    get adet() {
        return this.#adet; 
    }
    set adet(deger) {
        if (typeof deger !== "number" || deger < 0) {
            console.error("Hata: Adet negatif veya metin olamaz!");
            return;
        }
        this.#adet = deger;
    }
}


class IndirimliUrun extends Urun{
    #oran
    constructor(ad, fiyat, adet, oran) {
        super(ad, fiyat, adet);
        // 3.2 hakkında: bu hatayı sabah yaşamıştım tesadüfen, thisi superden once çağıramazsın diye hata veriyor.
        this.#oran = oran;
    }
    
   indirimliFiyatYazdir() {
        const maliyet = (this.fiyat * this.adet) * this.oran;
        return maliyet;
    }
    
get toplam() {
    // Doğrudan babanın hesapladığı tutarı (fiyat * adet) alıyoruz.
    return super.toplam * (1 - this.#oran); 
}
    // get toplam() { return this.fiyat * this.adet * (1 - this.#oran); }  // private yaptığımız adete tabii ki ulaşamayacağı için hata verir. normal çağırınca aldı ama. direkt erişim yapamazsın çünkü o babaya özel, sadece babadan izin alarak gidebilirsin yani düz this ile. o sana kendisi açar kasayı.
}

const iu1 = new IndirimliUrun("kitap", 75, 6, 0.8);
const iu2 = new IndirimliUrun("Oyun hamuru", 120, 4, 0.7);

const u1 = new Urun("abaküs", 180, 1);
const u2 = new Urun("makas", 50, 1);


console.log(iu1.fiyatYazdir());
console.log(iu1.indirimliFiyatYazdir());

//3.3

console.log(Object.getOwnPropertyNames(iu1));
//  →  ? ad,fiyat,adet,oran // adet motorun özel kasasında, onu öyle yazdığımı unutmuşum.

console.log(Object.getOwnPropertyNames(IndirimliUrun.prototype));
//  →  ? constructor, indirimliFiyatYazdir çıkmalı.

//3.4

console.log(Object.getPrototypeOf(IndirimliUrun.prototype)=== Urun.prototype) 
// →  ?  true
console.log(Object.getPrototypeOf(IndirimliUrun) === Urun) //
// →  ?  true
console.log(IndirimliUrun.olusturulan); // parentinde mevcut bu sayaç, dolayısıyla bütün oluşturulanları döndürür, sadece indirimli olanları değil.

console.log(Urun.karsilastir(iu2, iu1)); // çağırılabilir, niye çağırılamasın ki zaten.

// extends keywordu bellekte tek bir bağ değil, aynı anda iki farklı köprü kurar.

// /Birinci Köprü (Nesne Yetenekleri): Alt sınıfın prototipi olan IndirimliUrun.prototype, üst sınıfın prototipine (Urun.prototype) bağlanır. Kodda iu1.fiyatYazdir() komutu çalıştığında, motor önce alt sınıfın prototipinde bu metodu arar. Bulamayınca bu köprüyü kullanarak tırmanır ve Urun.prototype üzerindeki metoda ulaşır. Dolayısıyla Object.getPrototypeOf(IndirimliUrun.prototype) ifadesinin sonucu Urun.prototype ile birebir aynı referansı işaret eder.

//  İkinci Köprü(Durağan Yetenekler): Kılavuzların yanı sıra, alt sınıfın kurucu fonksiyonu(fabrikanın kendisi olan IndirimliUrun), doğrudan üst sınıfın kurucu fonksiyonuna(Urun) bağlanır.Bu bağlantının tek amacı, önceki derslerde yazdığın Urun.karsilastir veya Urun.olusturulan gibi statik üyelerin, IndirimliUrun üzerinden de kalıtım yoluyla erişilebilmesini sağlamaktır.Bu nedenle Object.getPrototypeOf(IndirimliUrun) ifadesinin sonucu doğrudan Urun referansını verir.


//3.5

console.log(iu1 instanceof IndirimliUrun)  // →  ? true, iu1'in babası
console.log(iu1 instanceof Urun         )  // →  ? true  iu1'in babasının babası
console.log(iu1 instanceof Object)  // →  ? true  iu1'in babasının babasının babası, ilk insan Adem

// instance of , prototip zincirini yani soy ağacını takip ederek yukarı çıkma kontrolüdür. varsa true, yoksa false döner.

Object.setPrototypeOf(iu1, null);
console.log(iu1 instanceof Urun)  // →  ?  (tahmin) // babasını değiştirdin, artık Urun onun babası değil false olması gerek eğer nullda saçmalamıyorsa(ki bu da ihtimal dahilinde, js çokça saçmalıyor bazen);

// bugünün en önemli keşfi dediğin ve sohbetin ilk kısmında oluşturduğun 3. bölüm sıralamasını bunun için kaydırdığın kır ve gör deneyi:








// 3.6 Aynı kalıtımı class kullanmadan, saf prototiple kur:
function Urun2(ad, fiyat, adet){

        this.ad = ad;
        this.fiyat = fiyat;
        this.adet = adet;    
        
}


Urun2.prototype.yazdir = function () { return this.fiyat }


function IndirimliUrun2(ad, fiyat, adet, oran) {
   Urun2.call(this, ad, fiyat, adet);
    this.oran = oran;
}




IndirimliUrun2.prototype = Object.create(Urun2.prototype);
IndirimliUrun2.prototype.constructor = IndirimliUrun2;

//IndirimliUrun2.prototype = Urun2.prototype // ikisini birbirine kaynaşır, normal ürünler de indirimli olur. herşey karışır. 


Object.defineProperty(IndirimliUrun2.prototype, "oran", {
    get() { return this._oran; },
    set(deger) {
        if (deger < 0 || deger > 1) throw new Error("Oran 0-1 arası olmalı");
        this._oran = deger;
    }
});


IndirimliUrun2.prototype.indirimliYazdir = function () { return this.yazdir() * this.oran; };

const normalUrun= new Urun2("silgi", 20, 3)
const testUrun = new IndirimliUrun2("Kitap", 100, 2, 0.8);
console.log(testUrun.yazdir());          // 100 ,Prototipten geldi
console.log(testUrun.indirimliYazdir());  // 80
console.log(testUrun instanceof Urun2);   // true


//console.log(testUrun.constructor.name)   //normalde IndirimliUrun2 dönmeliydi, kalıtım olayını bozduğumuz için Urun2 döndü.

//console.log(normalUrun.indirimliYazdir()); // NaN, olmayan değer ile hesaplamaya çalıştı. bi değer olsaydı yapmaması gereken indirimi yapacaktı.