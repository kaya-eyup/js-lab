
const url = "https://tr.wikipedia.org/wiki"

const sayfaAdi = "Orta Afrika Cumhuriyeti"


const uzunluk = url.length;
console.log(uzunluk);


const kelimeSayisi = sayfaAdi.trim().split(/\s+/).length;
console.log(kelimeSayisi);

const dogruStartMi = url.startsWith("https");
console.log(dogruStartMi);

const icindeVarMi = sayfaAdi.includes("Afrika");
console.log(icindeVarMi);


const trMap = {
   'ç': 'c', 'Ç': 'c',
   'ğ': 'g', 'Ğ': 'g',
   'ş': 's', 'Ş': 's',
   'ü': 'u', 'Ü': 'u',
   'ö': 'o', 'Ö': 'o',
   'ı': 'i', 'İ': 'i',
   'I': 'i'
 };


function formatWikiSlug(sayfaAdi) {
    //Wikipedia türkçe sitesi içindir.
   
 return sayfaAdi
  // Adım 1: Türkçe karakterleri İngilizce karşılıklarıyla değiştir
  .replace(/[çÇğĞşŞüÜöÖıİI]/g, char => trMap[char])
  
  // Adım 2: Baş ve sondaki gereksiz boşlukları sil
  .trim()
  // Adım 3: Harf (a-z), rakam (0-9), boşluk ve tire (-) DIŞINDAKİ her şeyi sil
  .replace(/[^a-zA-Z0-9\s-]/g, '')
  // Adım 4: Boşlukları tek bir altçizgiye (_) çevir
  .replace(/[\s-]+/g, '_')
  // Adım 5: URL'in en başında veya en sonunda altçizgi kaldıysa (edge case), onları temizle
  .replace(/^_+|_+$/g, '');

}




console.log(`${url}/${formatWikiSlug(sayfaAdi)}`)





// function createSlug(text) {
    
//     if (typeof text !== 'string') return ' ';


//     const trMap = {
//     'ç': 'c', 'Ç': 'c',
//     'ğ': 'g', 'Ğ': 'g',
//     'ş': 's', 'Ş': 's',
//     'ü': 'u', 'Ü': 'u',
//     'ö': 'o', 'Ö': 'o',
//     'ı': 'i', 'İ': 'i',
//     'I': 'i'
//   };

//    return text
//     // Adım 1: Türkçe karakterleri İngilizce karşılıklarıyla değiştir
//     .replace(/[çÇğĞşŞüÜöÖıİI]/g, char => trMap[char])
    
//     // Adım 2: Tüm metni küçük harfe çevir
//     .toLowerCase()
    
//     // Adım 3: Baş ve sondaki gereksiz boşlukları sil
//     .trim()
    
//     // Adım 4: Harf (a-z), rakam (0-9), boşluk ve tire (-) DIŞINDAKİ her şeyi sil
//     .replace(/[^a-z0-9\s-]/g, '')
    
//     // Adım 5: Boşlukları ve peş peşe gelen tireleri tek bir tireye (-) çevir
//     .replace(/[\s-]+/g, '-')
    
//     // Adım 6: URL'in en başında veya en sonunda tire kaldıysa (edge case), onları temizle
//     .replace(/^-+|-+$/g, '');
// }


// console.log(createSlug("   JavaScript'te %100 Başarı: İleri Seviye (Şov Yapma!)"   ));