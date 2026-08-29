class Urun {

    #adet;
    static olusturulan = 0;

    constructor(ad, fiyat, adet) {
        this.ad = ad;
        this.fiyat = fiyat;
        this.adet = adet;
        // kurucunun içinde:
        //this.olusturulan = (this.olusturulan || 0) + 1; yanlış model.
        // Yeni ürün üretildikçe fabrikanın ortak sayacını artır
        Urun.olusturulan++; // her ürün oluşturulduğunda sayaç artar.
        
    }

    static karsilastir(urunA, urunB) {
        return (urunA.fiyat - urunB.fiyat)
    }

    fiyatYazdir() {
        console.log(
            `${this.ad} sipariş/lerinizin toplam tutarı: ${this.toplam}`,
        );
    }
    get toplam() {
        return this.fiyat * this.adet;
    }
    get adet() {
        return this.#adet; //
    }

    // ADET İÇİN AYARLAYICI (SETTER) - Kapıdaki Koruma
    set adet(deger) {
        if (typeof deger !== "number" || deger < 0) {
            console.error("Hata: Adet negatif veya metin olamaz!");
            return;
        }
        // Doğrulamadan geçen veriyi geçilmez kasanın içine yazıyoruz
        this.#adet = deger;
    }
}

const u = new Urun("Defter", 85, 3);
 
console.log(u.toplam)  //
// u.toplam = 5   // getter'a setter olmadan dışarıdan atama yapamazsın, benimki katı modda.


// u._adet = 3;

 console.log(u._adet)   // →  ? 3 çıktı, deneyip sildim koddan.

// u.#adet  // →  ?  (dışarıdan; tahmin) private değişkene dışardan ulaşamazsın izin vermez, zaten eslint problems sekmesinde söylüyor.

// Kapsülleme (#adet): Veriyi bir çelik kasaya koyup dış dünyadan fiziksel olarak gizleme ve koruma işidir.

// Soyutlama (get adet / set adet): O çelik kasanın önüne, dışarıdaki adamın kafası karışmadan çok basitçe işlem yapabileceği bir vezne (arayüz) koyma işidir. Adam arka plandaki güvenlik protokollerini (typeof kontrollerini, # işaretlerini) bilmez, sadece u.adet = 5 yazar geçer.


//2.1
// console.log(typeof Urun) // obje // yanıldım, açıklama:
// // JavaScript'te class kavramı teknik olarak syntactic sugar sayılabilir. ES6 ile gelen bu modern ve derli toplu yazım tarzı, V8 motorunun derinliklerinde hala bildiğimiz klasik bir "Kurucu Fonksiyon" olarak derlenir ve işlenir. Motor class anahtar kelimesini gördüğünde yeni bir veri tipi yaratmaz, arka planda bildiğin fonksiyonu oluşturduğu için tipi function olarak tesciller. Bu detay sektördeki en popüler şaşırtmacalı mülakat sorularından biridir.

// console.log(Object.getPrototypeOf(u) === Urun.prototype); // true aynı referansı işaret ederler

//2.2
// console.log(Object.getOwnPropertyNames(u))              //   →  ? ad fiyat adet // doğru çıktı, sonradan adete get set ekleyince ad fiyat döndürdü burası.
// console.log(Object.getOwnPropertyNames(Urun.prototype)) //   →  ?    aynısı olmaz mı? olmazmış, haklıymışsın. özellik ve metod tek mekanizma gibi değil //Prototip, ürünlerin bireysel özelliklerini değil, o ürünlerin ortaklaşa kullanacağı evrensel araçları tutar.

//Sektörde mimariyi kurarken kural çok nettir:
// Veri (ad, fiyat, adet) her kullanıcı/ürün için farklı ve kişiseldir; bu yüzden doğrudan nesnenin kendi içine (u) yazılır.
// Yetenek (toplam(), indirimHesapla()) herkes için aynıdır; bu yüzden RAM'de boşuna yer kaplamaması için ortak referans merkezine (Urun.prototype) yazılır. Motor, getOwnPropertyNames ile bu keskin ayrımın bellekteki röntgenini çekmeni sağlamıştır.


//durağan üye deneyi

const d1 = new Urun("boya", 140, 2);
const d2 = new Urun("tuval", 420, 1);
const d3 = new Urun("fırça", 65, 4);

// console.log(d3.olusturulan); // sabahki modelimin yanlış olduğunu anladım artık , daha kaç defa yüzüme vuracaksın aq ahahahhaha

console.log(Urun.olusturulan) // 4 tane ürünümüz var.

console.log(Urun.karsilastir(d2, d1));