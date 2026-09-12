function firstNumber(arr: number[]): number {
  return arr[0];
}

const names1 = [12, 35, 88];
const x = firstNumber(names1);




function firstString(arr: string[]): string {
  return arr[0];
}

const names = ["ada", "linus"];
const y = firstString(names);




function firstAny(arr: any[]): any {
  return arr[0];
}

const anynames = ["ada", "linus"];
const n = firstAny(anynames);

// any yazınca IntelliSense'nin gözüne mil çekersin. hata durumları da gözükmez, runtime'da patlar. kötü bir yol açıkçası.
n.toUpperCase(); // hata vermez, girdimiz string olduğu için çalışır da. (n: any diyor üzerine gelince)
n.toFixed(2);    // hata vermez, runtime sırasında patlar. tam da istemediğimiz durum.
n.buMetotHicYok(); // bu bile hata vermez. aynı bi üstteki gibi.
 

// n.    sıfır öneri. dediğim gibi gözüne mil çektik any yazarak.


const nTest = firstAny(["ada", "linus"]);  // tip any
const uzunluk = nTest.length;              // tip any 
const yarisi = uzunluk / 2;                // tip number
const etiket = { deger: yarisi };          // tip number

// yukardaki olaya contamination deniyor. any bulaşıcıdır, matematiksel operatör bulaşmayı kırar.


// unknown vs any

// unknown, any'nin tip güvenli (type-safe) alternatifidir. İkisi de verinin ne olduğunu bilmediğini söyler ama derleyiciye verdikleri emir taban tabana zıttır.

function firstUnknown(arr: unknown[]): unknown {
  return arr[0];
}
const u = firstUnknown(["ada"]);

// @ts-expect-error: u'nun tipi 'unknown' olduğu için daraltma yapmadan metot çağrılamaz
u.toUpperCase(); // TS HATASI: 'u' is of type 'unknown'.


// generic sürümümüz:

function first<T>(arr: T[]): T | undefined { // undefined kontrolünden sonra possibly undefined hataları fırlattı. çözümü "var ise" kontrolü koymak, yani "?".
  return arr[0];
}
// bu noktadan sonra ts bizi korumasına alıyor, ? koymadan metoda erişemiyoruz zira undefined gelme ihtimali göz ardı edilemez.
const bos = first<string>([]); bos?.toUpperCase();


const namesT = ["ada", "linus"];

const g = first(namesT);

g?.toUpperCase(); // çalışır, string olduğunu kendi çıkarır.
// @ts-expect-error: string tipinde toFixed metodu bulunmaz (tip güvenliği testi)
g?.toFixed(1) // burda IntelliSense sadece string metodlarını çıkarıyor noktadan sonra. ve doğal olarak toFixed string tipi üzerinde yoktur diyor, apaçık.
// @ts-expect-error: string tipinde toFixed metodu bulunmaz (tip güvenliği testi)
g?.buMetotHicYok(); // yukarıdakinin aynısı. peki bu fonksiyona  bi de number[] paketi göndersek?

const numbersT = [3.14159, 18, 25.338 ];
const t = first(numbersT);


// @ts-expect-error: number tipine uppercase uygulayamazsın
t?.toUpperCase(); // number tipine uppercase uygulayamazsın uyarısı, beklendiği üzere.
t?.toFixed(2);   // IntelliSense noktadan sonra number metodları çıkarır. ve bu çalışır doğal olarak.

// @ts-expect-error: Property 'buMetotHicYok' does not exist on type 'number'
t?.buMetotHicYok(); // Property 'buMetotHicYok' does not exist on type 'number'. tabii ki.




// Bu üçlünün zihniyet farkı şudur:

// any (Kör Cehalet): "Bunun ne olduğunu bilmiyorum ama sen istediğin metodu çağır, ben seni engellemem." der. Güvensizdir, kod üretimde patlar.

// unknown (Bilinçli Cehalet): "Bunun ne olduğunu bilmiyorum, o yüzden sen bana bunun bir string olduğunu if (typeof u === 'string') ile kanıtlayana kadar sana hiçbir işlem yaptırmam." der. Kesinlikle güvenlidir ama her satırda manuel tip daraltması (narrowing) gerektirdiği için geliştiriciyi yorar.

// <T> Jenerik (Bilgelik): "İçeri ne gireceğini fonksiyonu yazarken bilmiyordum, ama sen bana çağrı anında ["ada"] dizisini verdiğin an bunun string olduğunu hafızama kazıdım. Daraltma yapmana gerek yok, string metotlarını güvenle kullan." der.

// Sektör kuralı nettir: Dış API'den gelen ve yapısı gerçekten belirsiz olan ham veriler için unknown kullanılır. Fonksiyonun şablonu belli ama içinden geçecek veri tipleri değişkenlik gösteriyorsa <T> (Generics) kullanılır. any ise koda dahil edilmez.