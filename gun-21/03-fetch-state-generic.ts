export {};

// Bölüm 1 · FetchState<T> tipi          (dünkü tipin jenerik hâli)
    
    
type FetchState<T> =
        
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
    | { status: "success"; data: T }
  // | { status: "refreshing" }; // burada verdiğimiz status renderdaki kontrolllerden direkt never durumuna düşüyor(direkt orayı gösteriyor hatada). tip olarak
    //Argument of type '{ status: "refreshing"; }' is not assignable to parameter of type 'never'.

    
// Bölüm 2 · render fonksiyonu jenerik   (switch + assertNever korunuyor)
    
    function assertNever(x: never): never {
  throw new Error(`Beklenmeyen durum: ${JSON.stringify(x)}`);
}

function render<T>(state: FetchState<T>): string {
  switch (state.status) {
    case "idle":
      return "Henüz başlamadı";
    case "loading":
      return "Yükleniyor...";
    case "error":
      return `Hata: ${state.message}`;
    case "success":
      return `Başarılı: ${String(state.data)}`; // burda T'nin ne olduğunun bilinmesi gerek.
    default:
      return assertNever(state);
    }

}
    
    
    
// Bölüm 3 · iki farklı tiple kanıt      (Product[] ve User)
    
    
    type Product = { id: number; title: string };
type User = { id: number; name: string; email: string };

const s1: FetchState<Product[]> = {
  status: "success",
  data: [{ id: 1, title: "Klavye" }],
};

const s2: FetchState<User> = {
  status: "success",
  data: { id: 7, name: "Ada", email: "ada@x.com" },
};

console.log(render(s1));
console.log(render(s2));
    

    if (s1.status === "success") {
  s1.data[0].title;        // Product olmalı, otomatik tamamlama gelmeli
}
if (s2.status === "success") {
  s2.data.email;           // User olmalı
}
    
    // @ts-expect-error : loading hâlinin data alanı yok
const kotu1: FetchState<Product[]> = { status: "loading", data: [] };

// @ts-expect-error : User beklenen yere Product veremezsin
const kotu2: FetchState<User> = { status: "success", data: { id: 1, title: "Klavye" } };



// Bölüm 4 · assertNever hâlâ çalışıyor mu?

//mekanizmayı ters kurmuşsun

// Yazdığım: "renderdaki kontrollerden direkt never durumuna düşüyor." satır 12

// Tersi oluyor. default dalına gelen state, tüm hâller ele alındığında nevere daralır; assertNever(x: never) de sadece never kabul ettiği için sorunsuz çağrılır. refreshing eklediğinde bu daralma artık gerçekleşmiyor, statein tipi { status: "refreshing" } olarak kalıyor — ve alıntıladığın mesaj tam bunu söylüyor: bu tip never parametresine atanamaz.

// Yani hata, bir şeyin never olmasından değil, never olmayı bırakmasından kaynaklanıyor. Alıntıladığın mesaj doğru okunmuş, mekanizmanın yönü ters. Mantık yanlışı değil, ifade yanlışı — ama loga doğru hâliyle geçsin.