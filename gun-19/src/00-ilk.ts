// Kır ve gör: strict: true iken tsc, "name'in tipini söylemedin" diyor (ts7006).
// strict: false iken hata YOK — görmezden gelmiyor, kural değişiyor:
// tipini yazmadığın şey sessizce "her şey olabilir" sayılıyor.
// Not: greet(42) iki durumda da temiz. Asıl hatam hâlâ yakalanmadı;
// yakalanması için name'in tipini benim söylemem gerekiyor.

// function greet(name) {
//   return "Merhaba " + name.toUpperCase();
// }

// greet(42); 