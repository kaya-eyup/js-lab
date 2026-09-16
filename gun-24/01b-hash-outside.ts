// bu dosya bilerek çalışmaz. 
export { };
console.log("01b başladı"); // yazdıracağını tahmin etmiştim ama yazdırmadı.
// neden direkt çöküyor da 01b başladı yazdıramıyor?
// Motor dosyayı çalıştırmadan önce tararken sözdizimi hatasından dolayı yürütme aşamasına hiç geçmez.

 class Box {
   #secret = 42;
 }
 class SubBox extends Box {
     read() {
       // @ts-expect-error:  Property '#secret' is not accessible outside class 'Box' because it has a private identifier.
     return this.#secret;   // 9 // '#' alanları kalıtıma kapalıdır; türetilen sınıflar üst sınıfın '#' alanına doğrudan dokunamaz.
   }
 }
 const box = new Box();
 // @ts-expect-error:  Property '#secret' is not accessible outside class 'Box' because it has a private identifier.
 console.log(box.#secret);  // 10 // dışardan ulaşamazsın.


// class ShortSecure {
//     // @ts-expect-error: Private identifiers cannot be used as parameters.  // kullılmayan hata tahmini direktifi diyor.
//   constructor(readonly #pin: string) {}   // 11 // bu hatası önceki dosyada yaşamıştım, özel alanları direkt parametre olarak atayamıyoruz.
// }

