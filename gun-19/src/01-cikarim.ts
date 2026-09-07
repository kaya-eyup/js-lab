 let isim = "Eyüp";  // isim.toFixed(2) yazmana izin vermiyor. Sen söylemeden bildi.

// Nasıl? Sağ tarafa baktı. "Eyüp" bir metin, o hâlde isim de metindir. Buna tip çıkarımı (type inference) deniyor: TypeScript'in, yazdığın değere bakarak tipi kendi başına anlaması.

// Bugünün sorusu şu: çıkarım nereye kadar çalışıyor, nerede duruyor, ve ne zaman senin istediğinden farklı bir sonuca varıyor? Üçüncüsü en önemlisi, çünkü hocanın "her yere tip yazmak acemi refleksidir" cümlesinin sınırı orada.

// const kontrol: null = isim; // Type 'string' is not assignable to type 'null' hatası. şimdi anladın ne olduğunu.

// A)
//  let a = "Eyüp";
//  const b = "Eyüp";
//   let control: null = a;  // tip olarak "string" diyor.
//   const kontrol: null = b; // tip olarak "Eyüp" diyor.
// let gelecekte değiştirilebilir, bu yüzden tipini aldı sadece. o tip kapsamında değiştirebilirsin.
// const ise kesinlikle değişmez diyoruz, o da tipi en dar hale getirip  değerin kendisi yapıyor.

 // a = 42 // der isek bu sefer stringe number atayamazsın der.           

// gun-19/src/01-cikarim.ts:12:7 - error TS2322: Type 'string' is not assignable to type 'null'.

// 12   let control: null = a;  // tip olarak "string" diyor.
//          ~~~~~~~

// gun-19/src/01-cikarim.ts:13:9 - error TS2322: Type '"Eyüp"' is not assignable to type 'null'.

// 13   const kontrol: null = b; // tip olarak "Eyüp" diyor.
//            ~~~~~~~


// Found 3 errors in 2 files.

// Errors  Files
//      1  gun-19/src/00-ilk.ts:7
//      2  gun-19/src/01-cikarim.ts:12



// B)

// const sayilar = [1, 2, 3];
// const karisik = [1, "iki", true]; 

// let kontrol: null = sayilar;  // type 'number[]' is not assignable to type 'null'
// let control: null = karisik;  // Type '(string | number | boolean)[]' is not assignable to type 'null'.
// "|" işareti der ki = "benim adım birleşim(union), ben yazılan herhangi değerden biri olabilirim"

// sayilar.push("dört"); // Argument of type 'string' is not assignable to parameter of type 'number'.

// C)   

// const urun = { id: 1, title: "Telefon" };

// // let kontrol: null = urun; // Type '{ id: number; title: string; }' is not assignable to type 'null'.

// urun.price = 999; // Property 'price' does not exist on type '{ id: number; title: string; }'.
// urun.title = "Tablet"; // hata yok, const değişkenin işaret ettiği referansın değişmesine izin vermez, obje içindeki alanları değiştirebilirsin. ama önceki deneylerde const ile atanaan değişkende tipi daraltıp direkt değişkenin kendisi yapıyordu, burda sanırım içerideki değerlerin değişebileceğini hesap ederek daraltma yapmadı.
// urun.id = "1";   // Type 'string' is not assignable to type 'number'.

// // D)

// function ikiyeKatla(sayi: number) {
//     //  if (sayi < 0) return null; // bu satır hem number hem de null olabileceği bilgisini veriyor.
//   return sayi * 2;
// }
// const sonuc = ikiyeKatla(5);  // sonuc değişkeninin tipi number.


// E)

// const liste = []; // tip any
// liste.push("elma");


// let control: null = liste; // Type 'string[]' is not assignable to type 'null'.