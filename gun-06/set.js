//                      set
//Set, içerisine sadece benzersiz (unique) değerler alan bir veri yapısıdır. Bir Set içine aynı değeri iki kez eklersen, ikincisini sessizce yok sayar.

const visitedCities = ["İstanbul", "İzmir", "Antalya", "İstanbul", "Antalya"];
console.log(visitedCities);


const reworked = new Set(visitedCities);

console.log(reworked);


const yenideneme = new Set();

yenideneme.add(10);
yenideneme.add(25);
yenideneme.add(56);
yenideneme.add("mehmet");

console.log(yenideneme);

yenideneme.delete(10);
// yenideneme.clear() bütün değerleri siler.
console.log(yenideneme.has(10));
const dizideneme = [...yenideneme];
console.log(dizideneme);


for (let x of yenideneme) {
    console.log(x);
}