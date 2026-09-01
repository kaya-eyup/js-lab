// ========================================
// DÜZEN PROMISE (Plain Promise)
// ========================================

// 1. Sunucunun durumunu taklit eden bir değişken tanımlıyoruz. 
// false olduğu için sunucu kapalı veya giriş başarısız gibi davranacak.
const serverStatus = false;

// 2. new Promise ile yeni bir "Söz" nesnesi oluşturuyoruz.
// Bu nesne içerisine iki adet fonksiyon alır: 
// - resolve: İşlem başarılıysa çağrılır.
// - reject: İşlem başarısızsa (hata varsa) çağrılır.
const promise = new Promise((resolve, reject) => {
    
    // 3. Gerçek hayattaki bir network (ağ) isteğini taklit etmek için 
    // 1000 milisaniye (1 saniye) gecikme uyguluyoruz.
    setTimeout(() => {
        
        // 4. Eğer serverStatus true ise (giriş başarılıysa)
        if (serverStatus) { 
            // resolve fonksiyonunu çağır ve içine kullanıcı verisini (obje) koy.
            resolve({ username: "Eyüp Kaya" }); 
        }
        // 5. Eğer serverStatus false ise (giriş başarısızsa)
        else {
            // reject fonksiyonunu çağır ve içine hata mesajını (string) koy.
            reject(new Error("Login failed"));
        }
        
    }, 1000); // 1 saniyelik asenkron bekleme süresi
});

// 6. Tüketim Kısmı: Oluşturduğumuz promise nesnesinin sonucunu bekliyoruz.
promise
    // Eğer yukarıda "resolve" çağrılırsa buradaki .then() çalışır.
    // resolve içine gönderilen { username: "Eyüp Kaya" } objesi "user" değişkenine aktarılır.
    .then(user => { 
        console.log(user); 
    })
    // Eğer yukarıda "reject" çağrılırsa buradaki .catch() çalışır.
    // reject içine gönderilen "login error" metni "err" değişkenine aktarılır.
    .catch(err => { 
        console.log(err); // serverStatus false olduğu için ekrana "login error" yazacak.
    });
