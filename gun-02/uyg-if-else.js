//                            If/Else uygulamaları

// 1- bir sayının pozitif, negatif veya sıfır olduğunu kontrol eden bir fonksiyon yazın.
function degerNe(sayi) {
  if (typeof sayi !== "number" || isNaN(sayi)) {
    return "Hata: Lütfen geçerli bir sayı girin.";
  }

  if (sayi > 0) return "Girilen değer pozitif";
  if (sayi < 0) return "Girilen değer negatif";
  return "Girilen değer 0";
}
console.log(degerNe(0));

// 2- Kaya adlı öğrencinin notlarını alıp, büyüklük sıralamasını yapınız.

function sirala(notVize, notFinal) {
  if (typeof notVize !== "number" || typeof notFinal !== "number") {
    return "Lütfen sayısal değerler giriniz.";
  }

  if (notVize === notFinal) return "Notlar birbirine eşittir.";

  const enYuksekNot = Math.max(notVize, notFinal);
  return `${enYuksekNot} yüksek olan notunuzdur.`;
}
console.log(sirala(45, 85));

// 3- Kaya adlı öğrencinin vize(40%) ve final(60%) notlarını alıp, geçip geçmediğini kontrol eden bir fonksiyon yaz. (Geçme notu 50)
//      a- eğer ortalama 50'den büyükse "Geçti" yazdırın.
//      b- geçme ortalaması 50 olsa bile final notu 50'den küçükse "Kaldı" yazdırın.
//      c- finalden 75 ve üzeri not almışsa, ortalama 50'nin altında olsa bile "Geçti" yazdırın.

function ortHesapla(vize, final) {
  if (typeof vize !== "number" || typeof final !== "number") {
    return "Lütfen sayısal değerler giriniz.";
  }
  if (vize < 0 || vize > 100 || final < 0 || final > 100) {
    return "Hata: Sınav notları 0 ile 100 arasında olmalıdır.";
    }
    
  const ortalama = final * 0.6 + vize * 0.4;

  if (final >= 75) return "Final notunuz çok yüksek olduğu için geçtiniz.";
  if (final < 50) return "Final notunuz çok düşük olduğu için kaldınız";
  if (ortalama >= 50) return "Dersi ortalamanız sayesinde geçtiniz.";

  return "Ortalamanız yüzünden kaldınız.";
}

console.log(ortHesapla(40, 54));
