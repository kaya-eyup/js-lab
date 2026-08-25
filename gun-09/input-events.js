//                              input eventleri

// input: Kullanıcı kutuya her harf yazdığında, sildiğinde veya kopyala - yapıştır yaptığında anında tetiklenir. (En çok anlık arama kutularında veya şifre gücü ölçmede kullanılır).

// change: Kullanıcı yazmayı bitirip input dışına tıkladığında veya Enter'a bastığında (değer kalıcı olarak değiştiğinde) tetiklenir. (En çok veri kaydetme veya checkbox/select seçimlerinde kullanılır).

// focus: Kullanıcı input alanının içine tıkladığında veya alan seçili hale geldiğinde tetiklenir. (Giriş alanını renklendirmek veya ipucu göstermek için kullanılır).

// blur: Kullanıcı input alanından çıkıp başka bir yere tıkladığında tetiklenir. (Kullanıcı yazmayı bitirip çıktığı an e - posta formatı doğru mu diye kontrol etmek için idealdir).

// submit: Doğrudan inputa ait olmasa da, içindeki verilerin bağlı olduğu form gönderildiği an tetiklenir. (Verileri sunucuya göndermeden önce son kontrolü yapmak için kullanılır).

 
//  Özet Örnek Senaryo
//  Bir üyelik formunda:Kutunun içine tıkladınız ➡️ focus çalışır(Kutu mavi olur).
//  Şifrenizi yazıyorsunuz ➡️ Her harfte input çalışır(Karakter sayısı anlık sayılır).
//  Yazmayı bitirip yandaki kutuya geçtiniz ➡️ blur ve change çalışır(Şifre kurallara uygun mu diye kontrol edilir).
//  Kaydet butonuna bastınız ➡️ submit çalışır(Veriler gönderilir).