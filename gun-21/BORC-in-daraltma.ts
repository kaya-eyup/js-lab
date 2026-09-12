// (a)
// Önce mantık: elinde iki farklı şekilde olabilen bir nesne var ve dündeki gibi status diye ortak bir ayırt edici alan yok. Ayırt etmenin yolu, bir alanın nesnede bulunup bulunmadığına bakmak. JS'in in operatörü bunu yapar ("ad" in obj → true/false), TypeScript de bu kontrolü görüp tipi daraltır.

type Admin = { name: string; permissions: string[] };
type Guest = { name: string; sessionId: string };

function describe(user: Admin | Guest): string {
if ("permissions" in user) {
    // TypeScript burada user'ın kesinlikle 'Admin' olduğunu bilir:
    return `${user.name}: ${user.permissions.length} yetki`;
    // user.sessionId // bu bloğa girmiş ise admin bloğundadır, admin bloğunda sessionId diye bir alan yok. TS akıllı birşey.
  }

  // Buraya düşen user ise zorunlu olarak 'Guest' tipindedir:
    return `${user.name}: misafir (${user.sessionId})`;
}
  

// (b)

// Verilen ipucunu incelediğimde fark doğrudan ortaya çıkıyor:

// (-0.5).toFixed(0) çıktısı: "-0" veya matematiksel yuvarlamayla "0" üretir. Çünkü toFixed bir string dönüşüm fonksiyonu değil, kayan noktalı sayıları yuvarlama ve formatlama fonksiyonudur.

// String(-0.5) çıktısı ise sayıyı olduğu gibi metne döker: "-0.5".

// Neden Yanlış Olduğunun Özeti:

// toFixed(0) bir dönüştürücü değil yuvarlayıcıdır; sayıyı formatlarken değerini sessizce değiştirip yuvarlar, oysa bir kimliği (ID) veya değeri olduğu gibi metne çevirmek için veri kaybı yaratmayan String(id) veya .toString() kullanılmalıdır.


// (c)

function func1(x: unknown) {
  // YANLIŞ / EKSİK:
  // if (typeof x === "object") { ... } -> x burada null olabilir!

  // DOĞRU (null korumalı):
  if (typeof x === "object" && x !== null) {
    // x artık güvenli bir şekilde nesne (object) olarak daraltıldı
    console.log("Güvenli nesne:", x);
  }
}