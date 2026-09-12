Jenerikler (generics), bir tipi sabitlemek yerine ÇAĞRI ANINDA doldurulacak
bir boşluk (tip parametresi) bırakmanı sağlar.

Nedir: <T> bir tip değil, tipin boşluğudur. Derleyici çağrıya bakıp T'ye
gerçek tipi yerleştirir ve denetimi ona göre yapar. Bu iş DERLEME ZAMANINDA
olur; kod çalışırken ortada T yoktur (tip silme / type erasure).

Asıl amaç ESNEKLİK DEĞİL, BAĞ kurmaktır: "ne girerse o çıkar." any de
esnektir ama bilgiyi siler; jenerik taşır.

Çıkarım (inference): tip argümanını çoğu zaman sen yazmazsın, derleyici
argümandan bulur. Elle yazmak gerekiyorsa ya bilgi yetersizdir ya imza
kötüdür.

Dışarıdan keskin, içeriden kör: gövdede T hakkında hiçbir şey
varsayamazsın, çünkü T her şey olabilir. (Çözümü: kısıt — yarın.)

Nerede: fonksiyon, arayüz, sınıf, tip takma adı. Zaten kullandıklarım:
Promise<T>, Array<T>, Map<K,V>.

Sektörde: API sarmalayıcıları, sayfalama, depo/önbellek yapıları —
"bir kez yaz, her veri tipiyle güvenle kullan".