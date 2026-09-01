// ========================================
// PROMISIFY - Callback'i Promise'e Dönüştürme
// ========================================

// Eski tarz: sonucu döndürmez, cb'yi çağırır.
// cb'nin düzeni: cb(error, result) — Node.js'in klasik biçimi
function getUser(id, cb) {
  setTimeout(() => {
    if (id === 1) cb(null, { id: 1, name: "Ada" });
    else cb(new Error("User not found"), null);
  }, 300);
}

// Promisify wrapper fonksiyonumuz
function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            // Orijinal fonksiyonu çağırıp son parametre olarak custom callback'imizi enjekte ediyoruz
            fn(...args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Fonksiyonumuzu promisify ediyoruz
const loginUserPromise = promisify(getUser);

// Artık modern Promise / async-await ile tüketebiliriz:
loginUserPromise(false)
    .then(user => console.log("Giriş başarılı:", user))
    .catch(err => console.error("Hata yakalandı:", err.message));

loginUserPromise(1).then(u => console.log("✅", u.name));            // → ✅ Ada
loginUserPromise(99).catch(e => console.log("❌", e.message));       // → ❌ User not found
