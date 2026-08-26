# Gün 10 — İzleme haritası (256-266)

## A. Gereksinimler (kullanıcı ne yapabilmeli)
- [ ] **Hoca dom content loaded ile ilk çalışma anında forma submiy özelliği veren fonksiyonu çağırdı.**
- [] **Kullanıcı listeye eleman ekleyebilmeli ve silebilmeli.**  tahmin: fonksyion içinde elemanı ooluştur, innerTextini inputvalueya bağla,ona bi çocuk olarak silme butonu ekle, sonra checkbox ekle ve listeye append et forma değil. sonra o fonksiyonu çağır. sonra silme fonksyionu, silme butonunu dataattribute ile çağır ve closest ile parenti olan ebeveyni tamamen silsin. // hoca bir dizi içinde obje olarak liste elemanına id name completed keylerini ekledi, sonra bunları oluşturma fonksiyonu içine bağladı.(deafult olarak gelen elemanlarımız) // fonksiyon(){checkbox, item, delete, li (li'ye append et hepsini)} // hoca eleman silmek için silme butonuna silmek fonksyionunu ekledi ve click anında çalıştırdı.
- [] **Kullanıcı listeye eklediği elemanın içeriğini düzenleyebilmeli.** tahmin: bilmiyorum. hoca: bi fonksyion tanımladı, item-completed attributesine sahip olmayan li  elemanlarına "contentEditable = true" verdi ve yaptı 
- [] **Kullanıcı listeye eklediği elemanı tamamlandı olarak işaretleyebilmeli.** tahmin: tamamlandı için checkboxın true olup olmadığını kontrol eden bi fonksyin yazılabilir. // hoca data attribute ile çağırdı ve eleman üretme eşamasında li'ye bu yazacağı fonksyionu toggleAttribute ile ekledi ve class ile görünür yaptı tamamlandı üst çizgisini. inputa event listener ile ekledi fonksiyonu. checkbox ile yukarı çıkıp itemname üzerini çizmek için parentElement kullandı. ben closest kullanacağım.
- [] **Kullanıcı listede olan elemanları tamamlandı-tamamlanmadı-hepsi şeklinde gösterebilmeli.** tahmin : ben olsam liste altında bunlarıönceden checkboxa atadığımız class özellikleri ile çekerim, üç butona birer özel class. hoca: bir döngü ile butonların kapsayıcı sınıfını çekti ve elemanlarına filtre fonksiyonunu ekledi. seçilen butona primary color ekledi. sonra bi fonksiyon içinde  döngü yazarak liste elemanlarını tek tek çağırdı ve completed sınıfına sahip olup olmama durumuna göre gösterdi, toggle ile yaptı. filtrelenmiş gösterimde güncelleme kısmını anlayaamdım
- [] **Kullanıcı listeyi bir buton ile tamamen temizleyebilmeli.** 
- [] **Kullanıcı listede eleman yoksa liste boş diye uyarılmalı.** 




## B. İlk kez gördüğüm DOM API'leri
| API | Tek cümlelik işi | park.md'ye mi? |
|  contentEditable| verildiği değişkenin contentini değiştirebilir yapıyor |  |
   ← sadece isim ve ne işe yaradığı. Nasıl kullanıldığını yazma, 10:00'da kendin bulacaksın.

## C. DOM'u hafıza olarak kullandığı yerler  ← bugünün asıl avı
- keyleri localstorage ile tarayıcı belleğinde sakllıyor ama ben çok anlamadım bu kısmı. bi localstorage fonksyionu yazdı ve bunu veride güncelleme yapabilen bütün fonksiyonların içine attı, ayrıca neden localstorage kullandığını da anlatmadı

