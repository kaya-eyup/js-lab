 const input = document.querySelector("#input");
const cikti = document.querySelector("#cikti");

input.addEventListener("input", () => {
    // Adım 1: İlk önce bununla dene
   // cikti.innerHTML = input.value;

    // Adım 4: Sonra bu satırı açıp üsttekini kapat
     cikti.textContent = input.value;
}); 

//innerHTML Tehlikelidir: Sen kutuya sadece bir yazı yazılacağını varsayarsın ama kötü niyetli biri oraya gizlice JavaScript kodu (<img onerror=...>) gömebilir. innerHTML bunu görünce "Aha bu bir HTML kodu, dur çalıştırayım" der ve yabancının yazdığı kodu senin sitende çalıştırır. Buna sektörde XSS (Cross-Site Scripting) denir.

//textContent Güvenlidir: textContent kullandığında tarayıcıya şunu dersin: "Kullanıcı ne yazarsa yazsın (isterse kod yazsın), bunu sadece düz yazı olarak kabul et ve ekrana öyle bas." Tarayıcı kodu çalıştırmaz, sadece ekranda metin olarak gösterir.

//Kıdemli Refleksi: Bir kullanıcının girdiği veriyle veya dışarıdan gelen bir API cevabıyla ekrana yazı basacaksan, elin otomatik olarak innerHTML'e değil, textContent'e gitmeli.

// gerçekten HTML basmak zorunda kalır ise, endüstri standardı kütüphaneleri arındırma işlemi için kullanmalısın.