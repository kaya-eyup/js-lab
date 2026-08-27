// ===== 1. REFERANSLAR =====        + arama kutusu referansı
// ===== 2. YARDIMCILAR =====        YENİ: debounce (ve öğleden sonra throttle)
// ===== 3. DURUM =====              + query alanı, başlangıç görevleri boşalacak
// ===== 4. DEPO (adaptör) =====     YENİ: storage.load() / save() / clear()
//                                   localStorage kelimesi SADECE burada geçecek
// ===== 5. ÇİZİM =====              createItem aynı, render'a arama süzgeci ekleniyor
// ===== 6. EYLEMLER =====           aynı 5 fonksiyon, ama içleri Adım 6'da değişecek
// ===== 7. [BOŞ KUTU] =====         Adım 3'te sayacağın sayı seni buraya getirecek
// ===== 8. OLAYLAR =====            + arama kutusunun input dinleyicisi
// ===== 9. BAŞLANGIÇ =====          YENİ: init() — ortadaki render(durum) çağrısı buraya taşınıyor