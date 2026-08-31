//"GET https://countries.dev/name/turkey      → isme göre arama"
//"GET https://countries.dev/alpha/TUR        → ISO koduna göre tek ülke"


// console.log("A");

// setTimeout(() => console.log("B"), 0);

// Promise.resolve().then(() => {
//   console.log("C");
//   Promise.resolve().then(() => console.log("D"));   // ← acil defter boşalırken YENİ acil iş
// });

// console.log("E");


// mühürlü tahmin
// console.log('1');
// setTimeout(() => console.log('2'), 0);
// Promise.resolve().then(() => console.log('3'));
// queueMicrotask(() => console.log('4'));
// console.log('5');


// 1-5-4-3-2 tahminim
// 1-5-3-4-2 çıktı


// Mikro görev kuyruğunda öncelik diye bir şey yok. Sadece deftere yazılma sırası var. İlk yazılan ilk çalışır.


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const t0 = performance.now();
console.log("başladı");

sleep(1000).then(() => {
  console.log("bitti", Math.round(performance.now() - t0), "ms");
});

console.log("bu satır hemen çalışır");
  

// tahmin: başladı, bu satır hemen çalışır, bitti. en fazla bikaç ms olur, 1005 1010 falan belki