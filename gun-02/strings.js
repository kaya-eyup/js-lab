                                    //strings

// var ad = 'Eyüp';
// var soyad = "Kaya";
// var yas = 20;
// var sehir = "Antalya";

// console.log(ad[2]);

// //template strings
// console.log(`Benim adım ${ad} ve soyadım ${soyad}. ${sehir}'da yaşıyorum. ${yas} yaşındayım. `)





                            // // STRING METHODS // //

// var plan = "Ne olursa olsun hayallerime ulaşıp başarılı olacağım";
// var gerceklik = "Şimdi öğrenme sürecindeyim"

// plan = gerceklik;

// console.log(plan);

// İlk değeri atarsın
var plan = "Ne olursa olsun hayallerime ulaşıp başarılı olacağım";
var gerceklik = "Şimdi öğrenme sürecindeyim";

// Eğer ilk değeri önce ekrana basıp SONRA değiştirirsen uyarı kaybolur:
console.log(plan.toUpperCase()); // İlk değer kullanılmış oldu!

    // plan = gerceklik.toLocaleLowerCase();
    // plan = gerceklik.length;
    // plan = gerceklik[25];
    // plan = gerceklik.slice(0, 6); // belirtilen indeksler arasını kesip getirir.
    // plan = gerceklik.slice(-10, -1);

    // plan = gerceklik.substring(10); 

    // plan = gerceklik.replace("Şimdi", "Şuan");

    //  plan = gerceklik.trim(); // başlangıç ve bitişteki boşlukları siler
    // plan = gerceklik.trimEnd(); 
    //  plan = gerceklik.trimStart(); 
     
    
    //  plan = gerceklik.indexOf("sürecindeyim"); 
    
    // plan = gerceklik.split(" "); // Metni belirtilen ayırıcı karaktere göre ayırır ve parçaları dizi olarak döndürür
     plan = gerceklik.split(" ")[2]; // anlamı= metni bölüp oluşturduğun dizinin 2 indeksli elemanını ver.
    
    


console.log(plan); // Yeni değer basılır
