export {};
// ===== Bölüm 1 — querySelector ne döndürüyor, .value neden derlenmiyor =====

const byTag = document.querySelector("input"); // HTMLInputElement | null
const byId = document.querySelector("#x"); // id ile alaklı beni uyarmıştın, burası element gelmeli. zira TS html'i okuyamaz.
// ts arkasında devasa bir sözlük çalıştırıp eşleştirme yapıyor. bu sözlük standart HTML etiketlerini kendi özel tipleriyle eşleştiriyor. id ve class rastgele metinlerdir ve TS senin HTML  dosyanı okumadığı için ne olduğunu tam olarak bilemez, bu yüzden en kapsayıcı sınıf olan Element'e çıkar. doğal olarak burda .value gibi özellikler yoktur.
const proofTag: HTMLInputElement | null = byTag;

// @ts-expect-error Type 'Element | null' is not assignable to type 'HTMLInputElement | null'. Type 'Element' is missing the following properties from type 'HTMLInputElement': accept, align, alt, autocomplete, and 190 more.
const proofId: HTMLInputElement | null = byId;

const xyz = document.querySelector("div input"); // en kapsayıcıya çıkar, element| null.

// @ts-expect-error: Object is possibly 'null'. && Property 'value' does not exist on type 'Element'.
console.log("Bölüm 1:", document.querySelector("#x").value); // bir valuedan dolayı, diğeri de null olma ihtimalinden dolayı.

// ===== Bölüm 2 — üç çözüm: as · tip parametresi · kontrol =====

// Bölüm 3'te sadece bu satır değişecek
const SELECTOR = "#x";
//const SELECTOR = "input"; // artık c0'da doğru yeri bulduğu için hata düştü.

// a temiz çıkmalı
try {
  const elementA = document.querySelector(SELECTOR) as HTMLInputElement;
  console.log("A:", elementA.value);
} catch (err) {
  console.log("A çöktü:", err);
}
// b de temiz çıkmalı
try {
  const elementB = document.querySelector<HTMLInputElement>(SELECTOR);
  if (elementB) {
    console.log("B:", elementB.value);
  }
} catch (err) {
  console.log("B çöktü:", err);
}

// sadece null kontrolü — yetmedi
try {
  const elementC0 = document.querySelector(SELECTOR);
  if (elementC0) {
    // @ts-expect-error: Property 'value' does not exist on type 'Element'.
    console.log("C0:", elementC0.value);
    }
    
} catch (err) {
  console.log("C0 çöktü:", err);
}

try {
  const elementC = document.querySelector(SELECTOR);

  // TAHMİN: TS bunu ayrı bir null kontrolü olmadan KABUL EDER.
  // DAYANAK: null ilkel (primitive) bir değerdir ve bir prototip zinciri yoktur.
  // Bu yüzden 'null instanceof HTMLInputElement' kodu çökmez, güvenli bir şekilde 'false' döner.
  // GEREKÇE (Ölçüm Sonucu): TS, instanceof kontrolünün null ihtimalini de otomatik elediğini (false döndüğünü) bilir ve tipi doğrudan HTMLInputElement'e daraltır.

  if (elementC instanceof HTMLInputElement) {
    console.log("C:", elementC.value);
  }
} catch (err) {
  console.log("C çöktü:", err);
}

// ===== Bölüm 3 — kırma: olmayan eleman, yanlış tür eleman =====
// tahmin     | #yok  | #wrong
// A  (as)        | çöker | undefined
// B  (tip)       | susar | undefined
// C0 (null)      | susar | undefined
// C  (inst.)     | susar | susar
// SELECTOR değişince typecheck çıktısı değişir mi?
// değişmez. neden?  "#x", "#yok" ve "#wrong" sözlükte yok, üçü de aynı son imzaya düşüyor. Sözlükte olan bir değer yazarsan çıktı değişir.

// #yok
//     A Çöktü:  TS'e as HTMLInputElement diyerek "Sana yemin ederim oradan bir eleman gelecek ve null olmayacak" dedim. TS bana güvendi, derleme hatası vermedi. Ama tarayıcıda kod çalıştığında document.querySelector null döndü. JS, null.value okumaya çalıştığı saniye TypeError: Cannot read properties of null diyerek patladı. TS'e yalan söylemenin bedelini runtime çökerek ödedi.

// B, C0 ve C Sustu: Çünkü bu üçünde de bir if kontrolü (guard) vardı. JS'te null falsy bir değerdir. if (null) veya if (null instanceof ...) her zaman false döner. Kod blokların içine girmediği için çökmeden sessizce atlandı.

// #wrong

// Burada eleman var (null değil), yani çökme tehlikesini atlattık. Ama eleman yanlış türde.

// A, undefined Verdi: Eleman null olmadığı için çökmedi. Ancak gelen eleman bir <div>. HTML'de div'lerin value niteliği yoktur. JavaScript'te bir nesnenin sahip olmadığı bir özelliğe erişirsen çökmez, undefined döner. Ben as ile TS'i susturduğum için, çalışma anına bu anlamsız veri sızmış oldu.

// B ve C0, undefined Verdi:

// B'de TS'e <HTMLInputElement> diyerek yalan söyledim.

// C0'da TS zaten "Element tipinde value olmaz" diye bağırıyordu.

// Ama ikisi de çalışma anında (runtime) sadece null kontrolü (if (element)) yaptı. Gelen div null olmadığı için kapıdan içeri alındı. İçeride div.value okunmaya çalışıldığı için undefined sızdı. Null'dan kurtuldular ama yanlış türden kurtulamadılar.

// C (instanceof) Sustu (Mükemmel Koruma):  C, gelen elemanın null olmadığını görmekle kalmadı, onun soy ağacına baktı. div instanceof HTMLInputElement işlemi çalışma anında false döndü (çünkü div, HTMLDivElement soyundandır). Hatalı veri kapıdan içeri giremedi, sessizce blok atlandı ve kod anlamsız veri (undefined) üretmekten korundu.

// ===== Bölüm 4 — karar: hangisi neden daha iyi (yorum) =====

function getInput(selector: string): HTMLInputElement {
  const element = document.querySelector(selector);

  // 1. Durum: Eleman hiç yoksa (null)
  if (!element) {
    throw new Error(`${selector} bulunamadı`);
  }
  // hiç yoksa erken çıkış için ilk sırada null kontrolü yapıldı. element.tagName null olma ihtimali çürütüldü.
  // 2. Durum: Eleman var ama input değilse
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`${selector} bulundu ama input değil: ${element.tagName}`);
  }

  // 3. Durum: Her iki engeli de aştı; TS artık bunun kesinlikle HTMLInputElement olduğunu bilir.
  return element;
}

// Çalışma anında neyin fırlatılacağını derleyici olarak asla bilemeyiz. O yüzden catch'e düşen her şeyi en katı tip olan unknown (bilinmeyen) kabul edeceğiz.


// 1. Durum: Var olan doğru eleman (#x)
try {
  const input = getInput("#x");
  console.log("Bulundu:", input.value);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Hata:", err.message);
    }
    else { throw err; }
}

// 2. Durum: Olmayan eleman (#yok)
try {
  const input = getInput("#yok");
  console.log("Bulundu:", input.value);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Hata:", err.message);
    }
    else { throw err; }
}

// 3. Durum: Yanlış tür eleman (#wrong -> DIV)
try {
  const input = getInput("#wrong");
  console.log("Bulundu:", input.value);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Hata:", err.message);
    }
    else { throw err; }
}

// Ölçüt: bu eleman olmadan sayfa işini yapabilir mi? Zorunluysa getInput, opsiyonelse C — sessiz atlama yalnızca opsiyonel elemanda doğru davranış.
// Zorunlu eleman: getInput > A > C > B. A en azından çöküyor, ama mesajı ("Cannot read properties of null") hangi satırda çöktüğünü söylüyor, hangi seçicinin neden bulunamadığını söylemiyor; getInput doğrudan "#yok bulunamadı" diyor.
// Opsiyonel eleman: C > B > A. Eleman yokken A sayfayı çökertiyor; getInput da aynı sebeple burada yanlış seçim.
// #wrong'da A, B ve C0 undefined sızdırdı, yalnızca C ve getInput türü çalışma anında kanıtladı. B'nin tip parametresi as'in başka kılığı, üstelik kod incelemesinde "as" aramasında görünmüyor.
// C0 çözüm değil: derlenmedi, çünkü null'u elemek türü kanıtlamaya yetmiyor.