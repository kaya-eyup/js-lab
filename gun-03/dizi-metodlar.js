//                                           Dizi metodları

// mutate eden metodlar, dizinin orjinalini de değiştirerek devam eden kodda kritik hatalara sebep olur;
// bu sebeple kullanman gerektiği zaman, mutate eden metodları dikkatli kullanmalısın.


//                          mutate eden metodlar            |||||||||||||   yeni dizi döndüren metodlar

//  push, pop, shift, unshift, splice, sort, reverse, fill, copywithin |||||||||||||  map, filter, slice, concat, flat, flatMap, toSorted, toReversed, toSpliced


//burada dizi metodları üzerinde deneyler yapacaksın. hem eski hem de yeni metodlar ile.


let users = ["Ali", "Deniz", "Ece", "Mehmet", "Fatih","Ece", "Terim"];
  


let sonuc;

// sonuc = users.indexOf('Mehmet'); //  içine yazılan elemanın bulunduğu İLK index numarasını verir.

// sonuc = users.lastIndexOf("Ece"); // içine yazılan elemanın bulunduğu SON index numarasını verir. findIndex fonksiyonlarına bak sonradan.


// uzunluk = users.length;

// sonuc = users.push("canan") // dizinin sonuna eleman ekleme, uzunluğu geri döner.

// sonuc = users.pop(); //dizinin sonundaki elemanı çıkarır ve elemanı geri döndürür.

// sonuc = users.shift(); //dizinin başındaki elemanı çıkarır ve elemanı geri döndürür.

sonuc = users.unshift("Yavuz","Ayşe"); //dizinin başına eleman ekler ve eleman sayısını geri döndürür.

// sonuc = users.splice(1, 2, "silinmiştir"); // (start: number, deleteCount: number, ...items: string[]), çıkanları geri döndürür. *** 'toSpliced' mutate etmez, silinen/eklenen elemanları değil, oluşturduğu yeni diziyi döndürür. denendi onaylandı***

// sonuc = users.sorted(); // alfabetik şekilde sıralar, stringe çevirerek sıraladığı için sayılarda hata verebilir. düzgün kullanılmalıdır. *** 'toSorted' mutate etmez, yeni dizi oluşturup döndürür. denendi onaylandı***

// sonuc = users.reverse(); //dizi eleman sırasını terse çevirir, *** 'toReversed' mutate etmez ve yeni dizi döndürür.

//  some(): Dizi içindeki elemanlardan en az bir tanesi bile şartı sağlıyorsa anında true döner.

// every(): Dizi içindeki elemanların istisnasız tümü şartı sağlıyorsa true döner. Bir tane bile fire varsa anında false basar ve çıkar.

// includes(): Belirli bir değerin (sayı, string vb.) dizinin içinde tam olarak var olup olmadığına bakar. (Sorgu fonksiyonu almaz, direkt değer alır: notlar. includes(100) gibi).

console.log(sonuc);

console.log(users);