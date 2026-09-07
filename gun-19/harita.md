1. TypeScript'in Temel Doğası

TypeScript, JavaScript'in üzerine inşa edilmiş statik bir derleme zamanı (compile-time) denetleyicisidir. Çalışma zamanında (runtime) hiçbir hükmü yoktur; tarayıcıya gitmeden önce tipler tamamen silinir ve geriye saf JavaScript kalır.

Kodun mimarisini editöre kanıtlama ve öğretme dilidir. Dış dünyadan (sunucudan) gelen veriyi denetlemez, sadece kendi yazdığın parçaların birbirine doğru bağlandığını garanti altına alır.

2. Derleyici (tsc) İşlevleri: Checker vs. Emitter

tsc komutu birbirine bağlı gibi duran iki bağımsız iş yapar: Kodda tip hatası var mı diye okur (check) ve tipleri silip saf .js dosyası üretir (emit).

Vite gibi hızlı geliştirme ortamları, zaman kaybetmemek için denetim (check) yapmadan doğrudan .js üretir. Projedeki gizli hataları yakalamak ve ayar dosyasını (tsconfig.json) devreye sokmak için terminalde her zaman .js dosyası kusmayan salt denetim komutu olan npx tsc --noEmit kullanılır.

3. Tür Onaylaması (Type Assertion: as)

as bir tür dönüşümü (conversion) değil, tür iddiasıdır. Çalışma zamanındaki veriyi asla değiştirmez (gerçek dönüşüm Number("25") ile yapılır). as sadece derleyiciye "bunun tipini ben biliyorum, bana güven" diyerek onu susturur. İddian yanlışsa, hatayı TypeScript'in bulacağı yerden alıp canlı ortama (production) taşımış olursun.

Bir araç değil, kaçış kapısıdır. Sadece derleyicinin ispatlayamayacağı ama senin kesin emin olduğun (örneğin querySelector'ın aranan elementi kesin bulacağı) nadir durumlarda kullanılır. Eski <string>x yapısı React/JSX ile çatıştığı için kullanılmaz, her zaman as kullanılır.

4. any vs unknown Ayrımı

any: "Bu her şey olabilir" demek değildir, "bu satırda kalite kontrol kalkanını kapat ve kör uçuşa geç" demektir. Parametrelere tip atanmadığında sızan örtük (implicit) any, kodu güvensiz JS ortamına geri döndürür.

unknown: "İçinde ne olduğunu bilmiyorum, o yüzden kullanmadan önce bana bunun tipini ispatla" diyen güvenli kalkandır. Dışarıdan veya API'den gelen verilerde kullanılır; ancak typeof veya if ile tip doğrulandıktan sonra işleme izin verir.

5. Tip Çıkarımı (Type Inference)

TypeScript atanan değere bakarak tipi kendi kendine anlar. let isim = "Eyüp"; yazıldığında TS bunun metin olduğunu zaten bilir. Her değişkene manuel olarak let isim: string yazmak gereksiz bir acemi refleksidir.