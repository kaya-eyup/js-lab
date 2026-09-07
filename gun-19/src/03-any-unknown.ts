// A-B
//const veri: any = "merhaba";
// const veri: unknown = "merhaba";

// veri.toUpperCase();
// veri.toFixed(2);
// veri.olmayanMetot();
// veri.a.b.c.d;
// veri();

// any yazmak sus benim işime karışma yazmak anlamına geliyor ya, o yüzden hata vermez.
//any derleyiciyi kör ederken, unknown derleyiciyi "bana bu verinin ne olduğunu kanıtlamadan hiçbir metodu çalıştırmana izin vermem" diyen şüpheci bir bekçiye dönüştürür. Güvenlidir. her satırda hata verir.


// C)
// const veri3: unknown = "merhaba";

// if (typeof veri3 === "string") {
//   veri3.toUpperCase();   // burada çalışıyor mu? // evet
// }

// veri3.toUpperCase();     // buradaysa? // hayır.


//TypeScript "Control Flow Analysis" (Akış Analizi) yapar. typeof kontrolü sayesinde kodun o if bloğuna sadece ve sadece değer bir metinse gireceğini matematiksel olarak ispatlamış olursun ve TS o lokal kapsamda tipi unknown'dan string'e daraltır (narrowing).


// D)

//fetch ile dış dünyadan veri çekerken TypeScript'in kör noktasına girersin. cevap.json() metodunun yerleşik dönüş tipi any'dir. TS, sunucudan o an ne geleceğini bilemediği için tüm kontrolü sana bırakır ve aradan çekilir. // kapıyı kapatmak ise tek satır: Promise<unknown>
// async function getir(url: string)
// : Promise<unknown>
// {
//   const cevap = await fetch(url);
//   const veri = await cevap.json();
//   return veri;
// }

// //let kontrol : null = getir("abcd") // Type 'Promise<any>' is not assignable to type 'null'.
// const sonuc = await getir("https://dummyjson.com/products"); // burada awaiti burda kullanamazsın hatası veriyor, konumuzla alakasız. ama dediğin gibi tip hatası almıyorum.
// // aynı zamanda otomatik tamamlamayı da öldürüyor.
 //sonuc.buAlanYok.hicYok;   //sonuc.buAlanYok → undefined. Sonra undefined.hicYok → program çöker.