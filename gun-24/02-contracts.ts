export { };
// Söz listesi. Bir sınıfı yazmadan önce ona bir liste verirsin: "Bu sınıfta şu isimde ve şu şekilde metotlar olacak." Sınıfı yazarken bir ismi yanlış yazarsan TS listeye bakar ve sınıf satırında itiraz eder. Listenin adı interface, sınıfın listeye söz vermesinin adı implements. Listede metotların gövdesi yok, sadece isim ve şekil var.

// Boşluklu üst sınıf. Daire ile dikdörtgeni düşün. İkisinin "kendini tarif et" metodu aynı işi yapar ve Daire: 3.14 gibi bir çıktı verir. Farklı olan tek şey alan hesabı. Ortak metodu bir üst sınıfa bir kez yazarsın, alan hesabını ise gövdesiz bırakıp "her alt sınıf bunu doldurmak zorunda" dersin. Boşluğu dolmamış olduğu için üst sınıftan doğrudan nesne yapılamaz. Böyle bir sınıfın adı soyut sınıf (abstract class), gövdesiz bırakılan metodun adı soyut metot (abstract area(): number).
    
    
    
// ===== Bölüm 1 — interface + implements: toJson hatasını derleme anında yakala =====
    
    JSON.stringify // valuesi any, o yüzden birşey dememiş olabilir geçenki turda
    
    interface Serializable {
  toJSON(): unknown;
}
// @ts-expect-error: Class 'BrokenWallet' incorrectly implements interface 'Serializable'.
//   Property 'toJSON' is missing in type 'BrokenWallet' but required in type 'Serializable'.
// 02-contracts.ts(13, 3): 'toJSON' is declared here.
class BrokenWallet implements Serializable {
  #amount = 0;
  constructor(readonly owner: string) {}
  add(x: number): void {
    this.#amount += x;
  }
  toJson() { // hatanın sebebi
    return { owner: this.owner, amount: this.#amount };
  }
}

class Wallet implements Serializable{
     #amount = 0;
  constructor(readonly owner: string) {}
  add(x: number): void {
    this.#amount += x;
  }
  toJSON() {            // doğru isimlendirme
    return { owner: this.owner, amount: this.#amount };
  }
}



function save(item: Serializable): string {
  return JSON.stringify(item);
}

// implements yazmıyor
class SilentWallet {
  toJSON() {
    return "söz vermedim";
  }
}

// Tahmin: typecheck itiraz etmez.  
// Sınıfın veya nesnenin içinde toJSON metodu varsa, TS için Serializable sözleşmesini karşılıyordur.
console.log(save(new SilentWallet())); // "söz vermedim"
console.log(save({ toJSON: () => "düz nesne" })); // "düz nesne"

// Soru: implements yazmadan da geçiyorsa, implements ne katıyor?
// Cevap: Hataları kullanım anında (save çağrılırken) değil, sınıfı YAZDIĞIN satırda (BrokenWallet tanımında) anında yakalamanı sağlar. save() hiç olmasaydı bile implements o hatayı fırlatırdı.



// ===== Bölüm 2 — abstract class: ortak kod + doldurulması zorunlu boşluk =====
    
    abstract class Shape implements Serializable {
  constructor(readonly name: string) {}

  // Gövdesi yok, alt sınıflar doldurmak zorundaa
  abstract area(): number;

  // Ortak mantık
  describe(): string {
    return `${this.name}: ${this.area().toFixed(2)}`;
  }

  toJSON() {
    return { name: this.name, area: this.area() };
  }
}

class Circle extends Shape {
  constructor(readonly radius: number) {
    super("Daire");
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(readonly w: number, readonly h: number) {
    super("Dikdörtgen");
  }
  area(): number {
    return this.w * this.h;
  }
}

console.log("Circle describe:", new Circle(1).describe());             // "Daire: 3.14"
console.log("Rectangle describe:", new Rectangle(2, 3).describe());       // "Dikdörtgen: 6.00"
console.log("Rectangle JSON:", JSON.stringify(new Rectangle(2, 3)));  // {"name":"Dikdörtgen","area":6}

// Kanıt Satırları
// Tahmin (ghost): Soyut sınıftan doğrudan nesne üretilemez.
// @ts-expect-error: Cannot create an instance of an abstract class.
const ghost = new Shape("Hayalet");   // a

// Tahmin : Alt sınıf abstract metodu (area) doldurmamış.
// @ts-expect-error: Non-abstract class 'Triangle' does not implement inherited abstract member 'area' from class 'Shape'.
class Triangle extends Shape {}       // b

// ===== Bölüm 3 — çalışma anı: hangisi iz bırakıyor =====
    
    console.log("typeof Shape:", typeof Shape); // fonksiyon olmalı, classlar fonksyion nihayetinde
console.log("Circle instanceof Shape:", new Circle(1) instanceof Shape);  // true, prototip zinciri.

try {
  console.log("ghost:", ghost.describe());
} catch (err: unknown) { 
  if (err instanceof Error) {
    console.log("ghost:", err.message); // abstract silindi: new yasağı ve area satırı yok → nesne oluştu, this.area undefined → TypeError; hata sebepte değil ilk kullanımda
  } else { throw err; }
}

try {
  // @ts-expect-error: 'Serializable' only refers to a type, but is being used as a value here.
  console.log("Serializable check:", new Circle(1) instanceof Serializable);
} catch (err: unknown) { 
  if (err instanceof Error) {
    console.log("Serializable error:", err.message); // Serializable is not defined
  } else { throw err; }
} // interface runtime'da buharlaşır.
    
// ===== Bölüm 4 — karar (yorum) =====
// Ne zaman interface? -> Yalnızca veri yapısını (şeklini) tarif etmek ve sınıflara kurallar dayatmak istediğinde (çalışma anında sıfır kod, sıfır yük).
// Ne zaman abstract class? -> Hem kurallar dayatmak (boşluklar) hem de alt sınıfların kullanacağı ortak metotları/verileri (gerçek kod) tek bir yere toplamak istediğinde.
// Ne zaman ikisi birlikte? -> Temel sınıfın (Shape) ortak iş mantığını barındırırken aynı zamanda dış dünyaya karşı belirli bir standardı (Serializable - toJSON) garanti etmesi gerektiğinde
// Ölçülen iz: interface çalışma anında yok (instanceof → ReferenceError). abstract class'ın sınıfı ve ortak kodu kalıyor
// (typeof → function, instanceof çalışıyor), "new yasak" kuralı ve soyut metot siliniyor (ghost).
// Çalışma anında "bu nesne o aileden mi" diye sorman gerekiyorsa → sınıf; şekil yetiyorsa → interface.