export { };
//     Kavram

// Kod bazen TS'in göremediği bir dünyada çalışır. document'ı tarayıcı sağlar, process'i Node sağlar, HTML'e <script> ile eklenmiş bir kütüphane de kendi değişkenini sayfaya bırakır. TS bunların hiçbirini kendisi görmez. Birinin TS'e "bu şey var, tipi de bu, bana güven" demesi gerekir.

// Bunun adı ortam bildirimi (declare). declare ile yazılan bir satır çalışan kod üretmez, sadece bir söz verir. İçinde yalnızca bu tür sözler bulunan dosyaların uzantısı .d.ts. Başkalarının yazıp paket olarak paylaştığı .d.ts dosyaları @types/* paketleridir.
    
    

// ===== Bölüm 1 — lib.dom.d.ts: aynı isim, iki dünya =====
// 1. Ctrl+Tık yapılan dosya: lib.dom.d.ts
// 3. HTMLInputElement için lib.dom.d.ts iki söz veriyor: bir tip (interface) ve bir değer (declare var). Değerin kendisini tarayıcı sağlıyor —
//    Node'da bu söz de document gibi tutulmaz. Serializable için değer sözü hiç yok, bu yüzden TS derleme anında itiraz etti.
    
// ===== Bölüm 2 — TS biliyor, ortam bilmiyor: document =====
// Tahmin (typeof): typecheck itiraz etmiyor, ama undefined. 
// Tahmin (title): typecheck itiraz ETMEZ. Çalışma anında Node.js "ReferenceError: document is not defined" fırlatarak çöker çünkü Node'da DOM yoktur.
console.log("typeof document:", typeof document);
try {
  console.log("title:", document.title);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Failed to read document:", err.message); // ReferenceError
  } else { throw err; }
}

// ===== Bölüm 3 — ortam biliyor, TS bilmiyor: process → @types/node =====
// Tahmin: typecheck itiraz EDER (Cannot find name 'process'). Çalışma anında ise çökmeyip Node versiyonunu (örn: v20.x) yazar çünkü 'process' Node'un kalbinde zaten vardır.

// @ts-expect-error: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
console.log("node:", process.version);

// 2. npm i -D @types/node kurduktan sonra TS artık 'process'i tanıyacak. O zaman yukarıdaki @ts-expect-error itirazı kendisi bir hataya dönüşecek (Unused directive). Paketi kurduktan sonra o direktifi silmek gerek
// 3. node_modules/@types/node/ içinde .js dosyası var mı?: Hayır, sadece .d.ts var. İçlerinde çalışan sıfır satır kod bulunur.

// ===== Bölüm 4 — kendi declare'in =====
declare const APP_VERSION: string;

// typecheck "sözüne güveniyorum" der ve onaylar. Çalışma anında "ReferenceError: APP_VERSION is not defined" diyerek çöker çünkü TS'i kandırdık, ortamda böyle bir değişken yok.
try {
  console.log("version:", APP_VERSION);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Failed to read APP_VERSION:", err.message);
  } else { throw err; }
}

// ===== Bölüm 5 — karar =====

//                  | TS biliyor mu | Node'da var mı
// document         | Evet          | Hayır
// process (önce)   | Hayır         | Evet
// process (sonra)  | Evet          | Evet
// APP_VERSION      | Evet          | Hayır

// Karar:
// declare bir iddia mı, bir kanıt mı?: declare sadece kör bir iddiadır (sözdür); derleyiciyi inandırır ama çalışma anı için hiçbir kanıt/değer üretmez.
// @types/node paketini kurmak çalışma anına ne ekledi?: Hiçbir şey (0 bayt) eklemedi. Sadece TS'in derleme anında Node.js'in global değişkenlerini tanımasını sağladı.