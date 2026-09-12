export {};


// Bölüm 1 · Jenerik arayüz  → Box<T>, iki farklı tiple kullanım
    
    interface Box<T> {
  value: T;
  createdAt: number;
}
    
    const nameBox: Box<string> = { value: "ada", createdAt: Date.now() };
const productBox: Box<{ id: number; title: string }> = {
  value: { id: 1, title: "Klavye" },
  createdAt: Date.now(),
};
    
nameBox.value.toUpperCase(); 
productBox.value.title;
// @ts-expect-error : Property 'toFixed' does not exist on type 'string'. Did you mean 'fixed'?
nameBox.value.toFixed(2);
function unwrap<T>(box: Box<T>): T {
  return box.value;
}

const v = unwrap(nameBox);   // v'nin tipi ne? tahmin yaz, sonra ölç // string tabii ki. 

    
// Bölüm 2 · Jenerik sınıf   → Store<T> (add / getAll / count)
    
class Store<T> {
  private items: T[] = [];

  add(item: T): void {
      this.items.push(item);
  }

  getAll(): T[] {
      return [...this.items];
  }

  count(): number {
      return this.items.length;
  }
}    
    
const stringStore = new Store<string>();
stringStore.add("a");
stringStore.add("b");

console.log(stringStore.getAll());   // ["a", "b"]
console.log(stringStore.count());    // 2
console.log(stringStore.getAll()[0].toUpperCase());   // "A"
// çıktılar istendiği gibi.

// @ts-expect-error
stringStore.add(42) // hata. lakin expect error ile susturur isem kapı açık kalır. ve bu içeriye sızar.

// susturma sonrası :  [ 'a', 'b', 42 ] | count: 3

console.log(stringStore.getAll()[2].toUpperCase()) // →  TypeError: not a function, runtime'da patladı. en istenmeyen durum.


type Product = { id: number; title: string };

const productStore = new Store<Product>();
productStore.add({ id: 1, title: "Klavye" });
productStore.add({ id: 2, title: "Fare" });

console.log(productStore.getAll().map((p) => p.title));   // ["Klavye", "Fare"]
// çıktılar istendiği gibi.

// Bölüm 3 · Kır deneyi      → yanlış tip eklemeyi dene + Box'ta çıkarım

// 1) yanlış tip ekleme
// @ts-expect-error
stringStore.add(42);  // tip hatası verir, string storuna number ekleyemezsin

// 2) private alana dışarıdan erişim
// @ts-expect-error
console.log(stringStore.items); // private bir alana dışarıdan erişilemez.

// 3) tip argümanını hiç yazmazsan?
const mystery = new Store();      // T ne oldu? tahmin: ?
mystery.add("a");
mystery.add(42);                  // bu geçer mi? // unknown. başlangıçta bi parametre tipi almaz ise unknown oluyor, ona istediğini eklersin ama runtime zamanında dizini döversin.
// @ts-expect-error : Object is of type 'unknown'.
mystery.getAll()[0].toUpperCase()   