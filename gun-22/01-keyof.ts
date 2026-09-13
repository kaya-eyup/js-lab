export {};
// Önce mantık, terim sonra

// Elinde bir kullanıcı nesnesi var ve şöyle bir yardımcı yazmak istiyorsun:


// getField(user, "name")   // → "Ada"
// getField(user, "id")     // → 1
// getField(user, "yas")    // → böyle bir alan yok, yazarken uyarsın

// Bugünkü araçlarınla bunu yazamazsın. İki şey eksik:

// Eksik 1 — "bu nesnenin alan adları" diye bir tip yok.
// key parametresine string yazarsan "yas" de geçer, "nmae" yazım hatası da geçer. Sana lazım olan şey "id" | "name" | "isActive" — yani alan adlarının kendisinden oluşan bir birleşim (union). Bunu elle yazabilirsin ama User tipine bir alan eklendiğinde elle yazdığın liste sessizce eskir. Otomatik türemeli.

// Bunu üreten araç: keyof. keyof User → "id" | "name" | "isActive".

// Eksik 2 — "o alanın değeri hangi tip" diye soramıyorsun.
// getField(user, "name") dönüşü string, getField(user, "id") dönüşü number olmalı. İkisi de aynı fonksiyondan çıkıyor ama tipleri farklı. Yani dönüş tipi, verilen anahtara bağlı olmalı.

// Bunu yapan araç: indeksli erişim (indexed access), yazımı T[K]. Bir nesneden değer okumakla aynı köşeli parantez, ama tip dünyasında: User["name"] → string.

// Üçüncü bir şey de var. Bazen elinde zaten gerçek bir nesne vardır ve tipini elle ikinci kez yazmak istemezsin (yazarsan ikisi zamanla ayrışır). Değerden tip üretmek için tip konumunda typeof kullanılır: typeof config.

// Dikkat — bugünün üçüncü kelime çakışması. typeof x === "string" çalışma anında değere bakar; type C = typeof config derleme anında tip üretir. Aynı kelime, iki ayrı dünya. (Bugün extendste de aynı durum vardı.)


    
    

// 1) User tipi + gerçek user nesnesi
    
    type User = {
  id: number;
  name: string;
  isActive: boolean;
};

const user: User = { id: 1, name: "Ada", isActive: true };
    
// 2) keyof ile anahtar birleşimi + iki kanıt satırı
    
    type UserKeys = keyof User;
    
    const k1: UserKeys = "name";  // geçmeli

// @ts-expect-error : Type '"yas"' is not assignable to type 'keyof User'.
const k2: UserKeys = "yas";

// @ts-expect-error : Type '1' is not assignable to type 'keyof User'.
const k3: UserKeys = 1;



// 3) tip konumunda typeof ile değerden tip çıkarma
    
    const config = { host: "localhost", port: 5173, secure: false };

type Config = typeof config;
type ConfigKeys = keyof typeof config; // configin keyleri oldu işte.
    
// @ts-expect-error : Property 'secure' is missing in type '{ host: string; port: number; }' but required in type '{ host: string; port: number; secure: boolean; }'.
//01-keyof.ts(57, 53): 'secure' is declared here.
const bad: Config = { host: "x", port: 1 };

// 4) T[K] ile alan değeri tipi
    
type NameType = User["name"]; // string
type IdOrName = User["id" | "name"]; // string or number
type AllValues = User[keyof User]; // keylerin tipleri. number, string ve boolean
    

// @ts-expect-error : Cannot access 'User.name' because 'User' is a type, but not a namespace. Did you mean to retrieve the type of the property 'name' in 'User' with 'User["name"]'?
type Yanlis = User.name;


// 5) getField — ana ürün
    
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 1. Dönüş tipi kesin 'string', toUpperCase çalışır.
const upper = getField(user, "name").toUpperCase();

// 2. Dönüş tipi kesin 'number', toUpperCase patlar.
// @ts-expect-error Property 'toUpperCase' does not exist on type 'number'.
const nope = getField(user, "id").toUpperCase();

// 3. Geçersiz key
// @ts-expect-error Argument of type '"yas"' is not assignable to parameter of type 'keyof User'.
const nope2 = getField(user, "yas");
    
    
// 6) deney 3: keyof vs Object.keys

const keys = Object.keys(user);
// Tahmin:  string[] döner. Çünkü Object.keys çalışma zamanında çalışır ve JS motoru tipleri bilmez, sadece objenin string key'lerini okur.
// Object.keys string[] döner çünkü bir tip, değerin sahip olduğu alanların tamamını değil, en azını tarif eder. keyof T "tipte yazan anahtarlar"dır; Object.keys(o) "çalışma anında gerçekten var olan anahtarlar"dır. İkincisi birincisinin üst kümesi olabilir.
// çözümü:

// Bilinçli yalan, tek yerde toplanmış
function typedKeys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}


// tahminin doğruysa bu satır patlar, yanlışsa geçer
// @ts-expect-error : Type 'string' is not assignable to type 'keyof User'.
const k: keyof User = keys[0];