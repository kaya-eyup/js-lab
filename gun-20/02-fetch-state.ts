type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: string }
 // | { status: "refreshing" }; // 1. TEST İÇİN EKLENDİ

// Bütünlük Denetimi (Exhaustiveness Check) Yardımcısı
function assertNever(x: never): never {
  throw new Error(`Ele alınmayan durum: ${JSON.stringify(x)}`);
}

function render(state: FetchState): string {
  switch (state.status) {
    case "idle":
      return "Henüz istek yok.";
    case "loading":
      return "Yükleniyor...";
    case "success":
      return `Başarılı: ${state.data.join(", ")} ${state.data.length} ürün`;
    case "error":
      return `Hata: ${state.error}`;
    
    // 2. TİP DENETİMİ: Tüm case'ler yazıldıysa buraya düşen veri 'never' olmalıdır.
    default:
      return assertNever(state); // 'refreshing' varken burada hata patlayacak!
  }
}


console.log(render({ status: "idle" }));
 console.log(render({ status: "loading" }));
 console.log(render({ status: "success", data: ["a", "b"] }));
console.log(render({ status: "error", error: "404" }));
 
// const s: FetchState = { status: "loading", error: "x" }; // Object literal may only specify known properties, and 'error' does not exist in type '{ status: "loading"; }'.
// TypeScript, s değişkeninin tipini FetchState olarak biliyor. FetchState'in dört durumu var: idle, loading, success ve error. loading durumunda sadece status özelliği var, error özelliği yok. Bu yüzden TypeScript hata veriyor.



// 3. ölçüm deneyinin sonucu:

// Üç hata, tek sebep

// success satırını yorum satırına aldığın an FetchState üç ihtimale düştü: idle, loading, error. Şimdi 16. satıra kadar olan yolu takip et:

// satır idle olma ihtimalini eledi (girip döndü)
// satır loading'i eledi
// satıra gelindiğinde geriye tek ihtimal kaldı: error

// TypeScript bunu biliyor. O yüzden 16. satırda state.status artık "üç şeyden biri" değil, tam olarak "error".

// Birinci hata (Ln 16): "error" === "success" karşılaştırmasını yapıyorsun. TypeScript'in söylediği şey "bu yanlış" değil, "bu karşılaştırma hiçbir zaman doğru olamaz". İki sabit metnin ortak değeri yok. Yani yazdığın if bloğu ölü kod.

// Bunun pratikte ne kadar değerli olduğunu görmek için şunu dene, 10 saniye: success satırını geri aç ve if (state.status === "succes") yaz, tek s ile. Aynı hatayı alacaksın. Durum adındaki yazım hatası derleme anında yakalanıyor. Aynı hatayı isLoading + data + error üçlüsünde yapsan hiçbir uyarı almazsın, sadece ekranda hiçbir şey görünmez.

// İkinci hata (Ln 17): never.

// Sade hâli: if bloğunun içine girdin. TypeScript soruyor — "burada state ne olabilir?" Üç ihtimal vardı, ikisi elendi, kalan tek ihtimalin status'u "error". Ama bu blok ancak status "success" ise çalışır. Hiçbir ihtimal bu şartı sağlamıyor.

// Elinde dört isim yazılı bir liste var, üçünü çizdin, kalan tek isim "Ali". Sonra soruyorsun: "listede kalan 'Veli' hangisi?" Cevap yok. Hiç kimse. Boş küme.

// İşte o boş kümenin adı never: hiçbir değerin ait olamayacağı tip. never'ın alanı da olmaz, çünkü onun hiç örneği yok. state.data bu yüzden patlıyor — okuyacağın bir nesne yok ki alanı olsun.

// Sırayı fark et: 16. satırdaki hatalı varsayım, 17. satırda imkânsız bir bloğa dönüştü. Bir yanlış, kendi sonucunu doğurdu.

// Üçüncü hata (Ln 28): çağıran taraf. render({status:"success", ...}) artık geçersiz, çünkü öyle bir durum kalmadı.