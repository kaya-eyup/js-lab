// 1
function firstC<T>(arr: T[]): T | undefined {
  return arr[0];
}

firstC(["a", "b"]);        // T = ? string
firstC([1, 2, 3]);         // T = ? number
firstC([1, "a"]);          // T = ? string ve number
firstC([{ id: 1 }, { id: 2 }]);   // T = ?  komple içini gösterir

// 2
firstC([]);                // T = ?   ← şaşıracaksın // İçinde hiçbir şey yok ve ne olacağına dair bir ipucu da yok, o zaman bu hiçbir zaman var olamayacak bir tiptir. never.
firstC<string>([]);        // T = ? string tabii ki


function makeEmpty<T>(): T[] {
  return [];
}
const arr = makeEmpty();          // T = ?   ← argüman yok, nereden bilsin? bu yüzden unknown
const arr2: string[] = makeEmpty();  // T = ?  ← peki şimdi? bir string dizisi üzerinde uyguladığımız için aklına bu string diye kazıyor olabilir mi?

// 3, iki parametre


function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

pair("ada", 30);          // A = ?  B = ? string ve number doğal olarak
pair(30, 30);             // A = ?  B = ?  ← ikisi aynı tip olursa birleşir mi?
// neden birleşsin ki? bunların ayrı veriler olduğunu en başta A, B yazarak tanımlamadık mı zaten?

// 4, elle ezmek

const a = firstC<string>(["ada", "linus"]);   // sorun yok   // elle tip atamak buna deniyor. 
// @ts-expect-error
const b = firstC<string>([1, 2, 3]);          // tahmin: hata verir mi? verir tabii ki, onu en başta hafızasına string diye kazıdı.


// tipi elle atamak ve as yazmanın farkları:

//  el ile tip atamak derleyiciye kural koymaktır, "as" yazmak ise derleyiciyi susturup yalan söylemektir.


// Elle yazdığın tip argümanı, o tip parametresinin girdilerde de görünüp görünmediği kadar güvenlidir.
// T parametrelerde geçiyorsa → denetlenir, "as"ten farklıdır.
// T yalnızca dönüş tipinde geçiyorsa → denetlenecek hiçbir şey yoktur, gizlenmiş bir "as"tir.