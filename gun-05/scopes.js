//                      Scopes (kapsam)  let: , const: bu iş için vardan da ha iyiler



//    global scope  (genel kapsam)
// var ad = "Eyüp";


// console.log(ad);

// function yazdir() {   // function scope
//     let ad = "Can";
//     let yas = 18;
//     console.log(ad, yas, cinsiyet);  // bu noktada şunu göz önünde bulundur: hoisting ile var değişşkeni tanımlaması yukarı çekilmesine rağmen değişkene değer ataması aşağıda kaldığı için hoisting tuzağına düştüm. bu yüzden let veya const kullanımı önemli, bloğun içine hapseder değişken tanımını.
    
// }


// fonksiyon, kapsamında istenen değer yok ise kapsam dışına çıkıp globalde arar.

//yazdir();
//   console.log(yas); fonksiyon içinde tanımlandığı için kapsam dışından erişilemez.


// if (true) {

//     let ad = "Canan";       // let ile block scope oluşturuldu, süslü parantez içinde.
//     var cinsiyet = "Kadın";  // bunu let ile oluştursaydın, kapsam dışına çıkamazdı ve 13. satırdaki fonksiyon için reference error dönerdi.
//     console.log(ad, cinsiyet);
// }
// console.log(ad, cinsiyet);



//fonksiyonlar kendi scopelarını oluşturur.
// ancak diğer blocklar yeni bir scope oluşturmaz.  (let ve const bu sorunu çözer.)



//          uygulama
// devTools ile debugger kullanmasını öğren. 
const sehir = "Antalya"; 

function birinciKat() {
    const ilce = "Konyaaltı"; 
    debugger;
    function ikinciKat() {
        const mahalle = "Pınarbaşı"; // callstack sırasıyla önce birinciKat, sonra ilerlemeye devam ederek ikinciKat fonksiyonunu çağırır
        
        // durdur
        debugger; 
        
        console.log(mahalle); 
        console.log(ilce);    
        console.log(sehir);   
    }
    
    ikinciKat();
}

birinciKat();