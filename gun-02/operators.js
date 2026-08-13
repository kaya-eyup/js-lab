// Operatörler
let sonuc;
let a=10, b=5, c=2;

// 1- Aritmetik operatörler

sonuc = a + b; // toplama
sonuc = a - b; // çıkarma
sonuc = a * b; // çarpma
sonuc = a / b; // bölme
sonuc = a % b; // mod alma
sonuc = a ** c; // üs alma

console.log(sonuc);

// sonuc = ++a; // a'yı 1 artırır ve sonuc'a atar
// sonuc = a++; // sonuc'a a'yı atar ve sonra a'yı 1 artırır
// sonuc = --a; // a'yı 1 azaltır ve sonuc'a atar
// sonuc = a--; // sonuc'a a'yı atar ve sonra a'yı 1 azaltır

// 2- Atama operatörler

sonuc = b; // atama
sonuc += b; // sonuc = sonuc + b
sonuc -= b; // sonuc = sonuc - b
sonuc *= b; // sonuc = sonuc * b
sonuc /= b; // sonuc = sonuc / b
sonuc %= b; // sonuc = sonuc % b
sonuc **= b; // sonuc = sonuc ** b
// sonuc += (a + b); // sonuc = sonuc + (a + b)

console.log(sonuc);

// 3- Karşılaştırma operatörler

sonuc = (a == b); // eşit mi
sonuc = (a != b); // eşit değil mi
sonuc = (a === b); // hem değer hem de tip olarak eşit mi
sonuc = (a !== b); // hem değer hem de tip olarak eşit değil mi
sonuc = (a > b); // büyük mü
sonuc = (a < b); // küçük mü
sonuc = (a >= b); // büyük veya eşit mi
sonuc = (a <= b); // küçük veya eşit mi

console.log(sonuc);


// 4- Mantıksal operatörler

