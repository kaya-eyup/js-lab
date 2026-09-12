// ① Aynı kalıp, iki farklı yazım — fark var mı?
    interface Product { id: number, title: string, price: number, description?: string}
type ProductAlias = { id: number, title: string, price: number, description?: string }
    
function formatProduct(p: Product): string { 
        return `${p.title} - ${p.price}`
}
     

// Şimdi ProductAlias (type) ile bir nesne oluşturalım
const myProduct: ProductAlias = {
  id: 1,
  title: "iPhone 15",
  price: 50000
};

 // parametre tipini iki şekilde de yazdım, sıkıntı çıkarmadı.
 // formatProduct, "Product" beklerken ona "ProductAlias" tipinde bir veri gönderiyoruz.
 console.log(formatProduct(myProduct)); // hata falan yok
 // ② Deney 1: aynı ismi iki kez tanımlarsan ne olur?
 //    (önce tahmin yaz)
 // Interface denemesi
 interface Product2 { id: number; }
 interface Product2 { stock: number; }


// Type denemesi
 
// @ts-expect-error
type ProductAlias2 = { id: number; };
 
// @ts-expect-error
 type ProductAlias2 = { stock: number; };
 // type ile yazınca duplicate uyarısı veriyor ama interface'de vermiyor.



 // @ts-expect-error
const p: Product = { id: 1 }   // Type '{ id: number; }' is missing the following properties from type 'Product': title, price


// @ts-expect-error
const p2: Product2 = { id: 1 }   // Property 'stock' is missing in type '{ id: number; }' but required in type 'Product2'.ts(2741)
//                              00-interface-vs-type.ts(24, 23): 'stock' is declared here.


//Product2'yi { id: number } diye tanımladın, ama TypeScript senden stock da istiyor. Yani iki tanımı silmedi, üzerine yazmadı — birleştirdi. Şu an Product2 tek bir şey ve içinde ikisi de var.
//Buna bildirim birleştirme (declaration merging) deniyor: aynı isimde birden fazla interface yazarsan hepsi tek bir tipte toplanır.

//Nesne şekli tanımlıyorsan interface. Genişletilebilir olması ve hata mesajlarının daha okunur çıkması yüzünden.
// Nesne dışında bir şey tanımlıyorsan type — çünkü başka seçeneğin yok. type ID = string | number yazabilirsin, interface ile yazamazsın. Birazdan 01-narrowing.ts'te bunu göreceksin.