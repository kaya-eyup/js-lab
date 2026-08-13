//        If/Else koşul ifadeleri



let username = "eyupkaya";
let password = 12345;
let kosul = (username ==="eyupkaya" && password===12345);

if (kosul) {
    console.log("Uygulamaya giriş yapıldı");
}
else{ console.log("Kullanıcı adı veya şifre yanlış.")}


//        If/Else koşul ifadeleri-2

function ehliyetSorgula(yas, mezuniyet) {
    const mezuniyetSarti = ["lise", "universite"]; 

    if (yas < 18) return "Yaş kriteri sağlanmıyor.";
    if (!mezuniyetSarti.includes(mezuniyet)) return "Eğitim şartları sağlanmıyor.";

    return "Ehliyet almaya uygunsunuz."

    }

console.log(ehliyetSorgula(20, "lise"));


// ve (&&)
// veya (||)