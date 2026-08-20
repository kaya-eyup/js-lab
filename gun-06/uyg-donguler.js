// //                      uygulama: Döngüler


// let sayilar= [1, 18, 3, 8, 12, 25, 15 ];
// //sayilar dizisindeki her elemanın karesini alıp yazdır.

// for (let n = 0; n < sayilar.length; n++) {  // düz for döngüsü
//     const kare = sayilar[n] * sayilar[n];
//     console.log(kare);
    
// }
// for (const numaralar of sayilar) {          // for of döngüsü
//     let karenumaralar = numaralar * numaralar;
//     console.log(karenumaralar);
// }
// // sayilar dizisindeki 5in katı olan elemanları yazdır.
// for (let k = 0; k < sayilar.length; k++) {   // for döngüsü
//     const katlar = sayilar[k];
//     if (katlar % 5 === 0) {
//         console.log(`${katlar} sayısı 5in katıdır`)
//     }
// }
    
// for (const ofkatlar of sayilar) {
//     if (ofkatlar % 5=== 0) {
//         console.log(`${ofkatlar} sayısı 5i tam böler.`)
//     }
// }
// // 10 ve 20 arasındaki elemanları azalan şekilde yazdır.


// let sayilar1 = sayilar.filter(sayi => (sayi < 20 && sayi > 10));
// console.log(sayilar1);
// let siraliSayilar = sayilar1.toSorted((a,b)=> b-a);
// console.log(siraliSayilar);
 
// // bunu for döngüsü ile yapmak mantıksız ayrıca vaktim yetmez. yapamam.

// const dizi = ["a", "b", "c"];
// dizi.ekstra = "x";

// // TAHMİN (yorum satırına yaz, sonra çalıştır):
// for (const k in dizi) console.log(k, typeof k); //dizide for in kullanılır ise elemanların index numaralarını string olarak döndürür. 0,1,2 (yanlarında string yazarak) döndürecek ancak bi sonraki satırı da etkileyecek çünkü dışarıdaki metodları da işin içine katıyordu for in döngüsü. istenmeyen durumlara sebep olabilir.
// for (const k of dizi) console.log(k, typeof k); // burda üstteki tehlikeden dolayı bir etkilenme olacak, x değeri de çıkar tahminimce. // yanıldım, TODO yaz devamını

 let urunler = ["iphone 15", "Samsung s25", "iphone 16", "samsunG s26"];

//urunler listesindeki tüm elemanları büyük harfe çevir.
for (let m = 0; m < urunler.length; m++) {
    const buyukler = urunler[m].toLocaleUpperCase('tr-TR') // normal uppercase ingilizceye göre harfleri biçer
    console.log(buyukler)
};

// dizi içinde samsung kelimesine sahip kaç eleman var?
let num = 0;
for (let h = 0; h < urunler.length; h++) {
    const kelime = urunler[h];
    const kucukkelime = kelime.toLowerCase();
    
    if (kucukkelime.includes("samsung")) {
        num += 1;
        }
}
    console.log(num)
    
// Yeni: her üründen markayı ayıkla (split(" ")[0]) ve benzersiz marka listesini çıkar.

const markalar = new Set()
for (let k = 0; k < urunler.length; k++) {
    const sozcuk = urunler[k].toLocaleLowerCase('tr-TR');
    const marka = sozcuk.split(" ")[0]; // marka ile model arasını boşluktan ayır ve 0 indexli marka ismini çek
    markalar.add(marka);

}
console.log(markalar);


// const nesneler = [{ id: 1 }, { id: 1 }, { id: 2 }];
// console.log(new Set(nesneler).size);   // TAHMİN obje referans olarak alınır, bu yüzden aynı gözüken iki obje aslında farklıdır. set bu sebeple silemez. 3 çıkacak

// const benzersiz = [...new Map(nesneler.map(n => [n.id, n])).values()];
// Parçala: map → [[1,{...}], [1,{...}], [2,{...}]] üretir; new Map(...) aynı anahtarı ikinci kez görünce üstüne yazar; .values() değerleri verir; [...] diziye çevirir. Endüstride en yaygın kalıp budur — ama satırı ezberleme, dört adımı anla.


// // TAHMİN yaz, sonra çalıştır — üçünden hangisi patlar?
// for (const h of "merhaba") console.log(h); //merhaba döner, gezilebilir her elemanı döndüğü için harf harf.
// for (const x of new Set([1, 2, 3])) console.log(x); // 1,2,3 dönmeli. gayet sıradan bir for of ve set kullanımı, tek tek gezdiği için her zaman alt alta
// //for (const x of { ad: "Ali", yas: 20 }) console.log(x); // object kullanılmış iterable değildir. hata vermeli ve direkt benim dediğimi demeli %100 eminim.


//  console.log(typeof [][Symbol.iterator]); //function
//  console.log(typeof ""[Symbol.iterator]);   //function
//  console.log(typeof new Map()[Symbol.iterator]); //function
//  console.log(typeof ({})[Symbol.iterator]); //undefined, burada iterable olmak ile alakalı bir durum var ama anlayamadım. park.mdye at


// console.log([..."abc"]);              // ? abc çıkar, tek elemanlı dizi. //Güncelleme: string iterable olduğu için yukarda olduğu gibi parçalamalı harflerine. yukardaki gibi. bunu 2. unutuşum, not al.
// console.log([...new Set([1,1,2])]);   // ? 1 ve 2 çıkar, set tekrarlayan değeri görmezden gelir.
// // console.log([...{ a: 1 }]);           // ? — tahmin et  // obje iterable değil, spread da for of ile aynı şekilde çalışıyor. kabul etmez.


// //

// //
// //
    
// //
    
// // }


// //urunler listesinde içinde samsung geçen kaç eleman var?


// aşağıda obje içinde dizi olarak verilen örnekte, her öğrencinin not ortalamasını ve başarı durumunu hesaplayıp yazdırın.
// sonra tüm öğrencilerin not ortalamasını hesaplayın.

// let ogrenciler = [
//      { ad: "Ali", notlar: [50, 60, 70, 80] },
//      { ad: "Ayşe", notlar: [80, 90] },
//      { ad: "Mehmet", notlar: [40, 50, 20] }
//  ];


// // for (const {ad, notlar} of ogrenciler) {  // ogrenciler dizisinin içindeki objelerden ad ve notlar keylerini çağırıyorsın
    
// //     console.log(`${ad} ${notlar.length}`) // destructuring ile parçalandı. 
// // }
    
// // Görev: ogrenciler'i gez, her öğrenci için ortalama + başarı durumu hesapla (≥50 geçti), sonucu bir Map'e koy. Anahtar olarak öğrencinin adını değil, öğrenci nesnesinin kendisini kullan

// const notOrtalamasi = new Map();

// for (const ogrenci of ogrenciler) {
//     const toplamNot = ogrenci.notlar.reduce((acc, sayi) =>   acc + sayi, 0 ) // reduce ile sadece toplama yap, bölme işlemi sonra.
//     const ogrenciOrt = toplamNot / ogrenci.notlar.length;
//     const durum = ogrenciOrt >= 50 ? "dersi geçmiştir" : "dersten kalmıştır."
//     //            key= ogrenci objesi,  value = ortalama ve geçme durumu objesi.               
//     notOrtalamasi.set(ogrenci, {ortalama: ogrenciOrt, durum});
    

// }

// console.log([...notOrtalamasi]);                 // hızlı bakış

// const anahtar = { id: 1 };

// const m = new Map();
// m.set(anahtar, "map değeri");
// console.log(m.get(anahtar));      // TAHMİN get metodu, keyi girilen valueyi döndürür. "map değeri" 
// console.log(m.get({ id: 1 }));    // TAHMİN objeler referans ile saklanır. öyle bir key olmadığı için undefined yani tanımlanmamış.  

//  const o = {};
//  o[anahtar] = "obje değeri";
//  console.log(Object.keys(o));      // TAHMİN anahtar çıkmalı diye düşünüyorum , dizi içinde object object döndü. niye aq
//  console.log(JSON.stringify(m));   // TAHMİN   normal obje olsa dönüştürürdü sıkıntısız ama burda ne çıkacağını bilemiyorum. key olarak atanan objenin içini stringify edebilir     // boş obje döndü.
// console.log(JSON.stringify(o));   // TAHMİN     {"anahtar":"obje değeri"} çıkmalı // anahtara "[object Object]" yazmış, yukarda da aynısıydı.

//  Sade mantık: düz nesnede anahtar sadece metin olabilir. Metin olmayan bir şeyi anahtar yapmaya kalkarsan JS onu sessizce metne çevirir. Bir nesneyi metne çevirmenin varsayılan yolu ise içeriğine bakmak değil — sabit bir kalıp basmaktır: "[object Object]".

//JSON.stringify(), JavaScript nesnelerini veya dizilerini JSON formatında bir metne (string) dönüştürmek için kullanılan gömülü bir JavaScript metodudur.