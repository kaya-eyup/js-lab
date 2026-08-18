//                      fonksiyonlar

// fonksiyon içinde başka bi fonksiyon kullanılabilir
function selam(mesaj) {
    
    console.log(mesaj);

}
selam("merhaba");
  

function yas(dogumYili) {
    
    let tarih = new Date().getFullYear();
    return tarih - dogumYili;

}
console.log(yas(2005));