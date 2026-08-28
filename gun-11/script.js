// ===== 1. REFERANSLAR =====       
const liste = document.querySelector("#liste");
const uygulama = document.querySelector("#uygulama");
const yeniGorevInput = document.querySelector("#yeni-gorev");
const bilgi = document.querySelector("#bilgi");
const arama = document.querySelector("#arama");


// ===== 2. DURUM =====
const varsayilanDurum = {
  gorevler: [],
  filtre: "hepsi",
  aramaMetni: ""
};
// Sadece geliştirme için. Konsoldan demoYukle() yazıp sayfayı yenile.
const demoGorevler = [ { id: "1", name: "süt al", completed: false },
    { id: "2", name: "kod yaz", completed: true },
    { id: "3", name: "senior ol", completed: false },
    { id: "4", name: "ekonomik özgürlüğünü kazan", completed: false } ];
function demoYukle() {
  storage.save({ gorevler: demoGorevler, filtre: "hepsi" });
}
let durum = { ...varsayilanDurum };
// // ===== BAŞLANGIÇ =====
function init() {
  const kayitliVeri = storage.load();

  // Çağıran taraf kontrolü: Veri varsa ez, yoksa (null) varsayılanla devam et
  if (kayitliVeri !== null) {
    durum = {
      ...varsayilanDurum,
      ...kayitliVeri, 
      aramaMetni: "" // Arama metninin her açılışta temiz başlamasını garantiye alıyoruz
    };
  }

  render(durum);
}

// ===== DEPO (adaptör) =====
// KURAL: localStorage, JSON.parse ve JSON.stringify kelimeleri
// bu bloğun DIŞINDA hiçbir yerde geçmeyecek.

 const DEPO_ANAHTARI = "todo:v1";
 const storage = {
   // Kayıt varsa nesne olarak döndürür, hiç kayıt yoksa null döndürür
   load() {
     const kayitliMetin = localStorage.getItem(DEPO_ANAHTARI); 
  if (!kayitliMetin) return null; 

  try {
    return JSON.parse(kayitliMetin);
  } catch (hata) {
    console.warn("Depodaki veri bozuk, temizlenip sıfırlanıyor...", hata.message);
    this.clear(); // Bozuk veriyi silerek kendini onarır
    return null;  // init'e null döner, böylece init varsayılan durumla başlar
  }
   },
   // Verilen durum nesnesini deftere metin olarak yazar.
   save(durum) {
  try {
    const kaydedilecekVeri = {
      gorevler: durum.gorevler,
      filtre: durum.filtre
    };

    const metin = JSON.stringify(kaydedilecekVeri); 
    localStorage.setItem(DEPO_ANAHTARI, metin);
    return true; // Kayıt başarılı
  } catch (hata) {
    console.error("Depolama başarısız (Depo dolu veya engelli):", hata.name, hata.message);
    return false; // Kayıt başarısız
  }
   },






   // Kayıt sayfasını siler.
   clear() {
  
     localStorage.removeItem(DEPO_ANAHTARI); 
   }
};
    

// console.log(deneme);

// ===== 3. ÇİZİM =====

// elemanı üretme fonksiyonu.
function createItem(gorev) { 
    // 1. Liste Elemanı
    const li = document.createElement("li");
    li.dataset.id = gorev.id;
    if (gorev.completed) li.classList.add("completed");

    // 2. Checkbox
    const durumkontrol = document.createElement("input");
    durumkontrol.type = "checkbox";
    durumkontrol.checked = gorev.completed;
    durumkontrol.dataset.action = "degistir"
    // 3. İçerik
    const div = document.createElement("span");
  div.textContent = gorev.name;
   // div.textContent = gorev.name; // tehlikeli
  
    div.className = "metin"

    // 4. Sil Butonu
    const silButon = document.createElement("button");
    silButon.textContent = "X";
    silButon.dataset.action = "sil";

    // Birleştir
  li.appendChild(durumkontrol);
  li.appendChild(div);
  li.appendChild(silButon);

  // Üretilen tekil elemanı geriye dön
  return li;
  }



// render fonksiyonu tüm DOM detaylarıyla boğuşmaz; sadece listeyi gezip elemanları ekleme işini yönetir. createItem ise sadece tek bir li üretmeye odaklanır.

function render(durum) {
  // 1. Önceki listeyi temizle
  liste.innerHTML = "";

  // 2. Filtreye göre geçici liste türet (Derived State - Orijinal dizi bozulmaz)
  let gorunecekGorevler = durum.gorevler;

  if (durum.filtre === "bitmemis") {
    gorunecekGorevler = durum.gorevler.filter((g) => !g.completed);
  } else if (durum.filtre === "bitmis") {
    gorunecekGorevler = durum.gorevler.filter((g) => g.completed);
  }

//3. arama kutusu, eğer arama kutusu boşsa boşuna filtreleme döngüsüne girme, girdiysen düzgünce çift taraflı kalıplayarak arama yapç
if (durum.aramaMetni.trim() !== "") {
    const arananTemiz = durum.aramaMetni.trim().toLocaleLowerCase('tr-TR');
  gorunecekGorevler = gorunecekGorevler.filter(g =>
    g.name.toLocaleLowerCase('tr-TR').includes(arananTemiz)
  );
}
  // 4. Sadece filtrelenmiş görevleri ekrana çiz
  for (const gorev of gorunecekGorevler) {
    const liElement = createItem(gorev);
    liste.appendChild(liElement);
  }

  // 5. Bilgi Mesajı & Kenar Durum Yönetimi
  const toplamGorev = durum.gorevler.length;
  const kalanGorev = durum.gorevler.filter((g) => !g.completed).length;

  if (toplamGorev === 0) {
    bilgi.textContent = "Hiç göreviniz yok.";
  } else if (gorunecekGorevler.length === 0) {
    bilgi.textContent = "Bu filtreye uygun görev bulunamadı.";
  } else {
    bilgi.textContent = `${kalanGorev} tamamlanmamış göreviniz var.`;
  }

  // 6. Filtre Butonlarının Aktiflik Durumunu Güncelle
  const filtreButonlari = document.querySelectorAll('button[data-action="filtre"]');
  filtreButonlari.forEach((btn) => {
    // Butonun data-filtre değeri state'teki filtre ile aynıysa .aktif ekle, değilse sil
    if (btn.dataset.filtre === durum.filtre) {
      btn.classList.add("aktif");
    } else {
      btn.classList.remove("aktif");
    }
  });


  
  
} 


 // render(durum);



// ===== 4. EYLEMLER =====



// girilen görevi alır, ona id-name-completed değerleri ekler ve görevler dizisine push eder.
function gorevEkle(metin) {
  const temizMetin = metin.trim(); // state değişti
  if (!temizMetin) return; // Boşluk kontrolü temiz metinle yapılır

  const yeniGorev = {
    id:crypto.randomUUID(),       // Benzersiz id 
    name: temizMetin,      // Dışarıdan gelen metin
    completed: false        // başlangıçta görev tamamlanmamış olsun.
  };

  durum.gorevler.push(yeniGorev); // state değişti
  render(durum);
  storage.save(durum); // Ekrana çizdikten sonra depoya kaydet
     yeniGorevInput.value = ""; // state değişti
}
   


//   bir id değeri alır, o idye sahip olmayan görevleri tutar.
function gorevSil(id) {
  // durum.gorevler dizisini filtrele: ID'si gelen id'ye EŞİT OLMAYANLARI tut
  durum.gorevler = durum.gorevler.filter(g => g.id !== id); // state değişti

  // Hafıza güncellendi, ekranı yeniden çiz
  render(durum);
  storage.save(durum); // Ekrana çizdikten sonra depoya kaydet
}


// bir id değerini alır,o idye sahip olan değerin completed durumunu tersine çevirir.
function tamamlandiDegistir(id) {
// durum.gorevler dizisinde bul: ID'si gelen id'ye EŞİT OLANLARI tut
  const gorev = durum.gorevler.find(t => t.id === id); // state değişti
  if (!gorev) return;
gorev.completed = !gorev.completed;// state değişti, dizideki nesne DE değişti — geri atamaya gerek yok

// Hafıza güncellendi, ekranı yeniden çiz
  render(durum);
storage.save(durum); // Ekrana çizdikten sonra depoya kaydet
 }


// Gelen yeni filtre adını ("hepsi", "bitmemis", "bitmis") hafızaya kaydeder
function filtreAyarla(yeniFiltre) {
  durum.filtre = yeniFiltre; // Hafızadaki filtreyi güncelle // state değişti
  render(durum);             // Yeni filtreye göre ekranı tekrar çiz
  storage.save(durum); // Ekrana çizdikten sonra depoya kaydet

  
}

// Tüm görev listesini sıfırlar
function tumunuTemizle() {
  durum.gorevler = [];       // Diziyi tamamen boşalt // state değişti
  render(durum);             // Boş listeyi ekrana yansıt
  storage.save(durum); // Ekrana çizdikten sonra depoya kaydet

}

// arama yaparsın.
function aramaAyarla(metin) {
  
  durum.aramaMetni = metin; // aramaMetni değişkenine metinin içeriğini atar.  // state update 
  render(durum);
}

// debounce WRAPPER

function debounce(fonksiyon, gecikme) {
  let zamanlayici; // Bu değişken closure sayesinde hafızada asılı kalır

  return function (...args) {
    clearTimeout(zamanlayici); // Eski sayacı sıfırla
    
    zamanlayici = setTimeout(() => {
      fonksiyon.apply(this, args); // Gecikme bitince asıl fonksiyonu çalıştır
    }, gecikme);
  };
} // debounceyi farklı yerlerde de kullanacağımız için DRY prensibine uygun olarak bir kere tanımlıyorum.


// ===== 5. OLAYLAR =====


uygulama.addEventListener("click", (e) => { //Tüm uygulamayı kapsayan ana elemana bir tıklama dinleyicisi ekliyorsun. e parametresi, tıklama olayıyla ilgili tüm detayları barındıran nesnedir (Event nesnesi).

  const action = e.target.dataset.action; // kullanıcının ekranda tam olarak tıkladığı pikseldeki HTML elementidir. Bu satır, tıklanan elementin üzerindeki data-action niteliğini (attribute) okur. Örneğin; HTML'de <button data-action="sil"> varsa, action değişkeni "sil" değerini alır.

  if (!action) return; // guard clause, boş bi alana bastı ise fonksiyondan çık.

  const li = e.target.closest("li"); // Tıklanan hedefin (örneğin içerdeki bir ikon veya metin) DOM ağacında yukarı doğru çıkarak en yakın <li> etiketini bulmasını sağlar. Böylece tıklanan butonun hangi göreve ait olduğunu anlarız.

  const id = li ? (li.dataset.id) : null; // Eğer bir <li> bulunduysa, onun data-id değerini alır ve Number() ile sayıya çevirir (HTML dataset değerleri her zaman metin olarak gelir). Eğer <li> yoksa (örneğin yeni görev ekleme veya tümünü temizle butonuna tıklandıysa), id değeri null olur.

  // Konsola anlık işlem dökümü (Debug için)
  console.log("Tıklanan Eylem:", action, "| Görev ID:", id);  
    
  if (action === "sil")       gorevSil(id);   
  if (action === "degistir") tamamlandiDegistir(id); //Eylem "sil" veya "degistir" ise, yukarıda yakaladığımız o göreve ait eşsiz id değerini ilgili state güncelleme fonksiyonlarına gönderirsin.
  
  if (action === "ekle") gorevEkle(yeniGorevInput.value); // Eğer "ekle" butonuna tıklandıysa, doğrudan input'un içindeki değeri alıp state'e yeni görev olarak eklersin.

  if (action === "filtre") {  
    const filtreTipi = e.target.dataset.filtre;
    console.log("Seçilen Filtre:", filtreTipi);
     filtreAyarla(filtreTipi);
  } // Tıklanan filtre butonunun üzerindeki data-filtre değerini alıp filtreAyarla fonksiyonuna gönderiyorsun.

  if (action === "temizle") { tumunuTemizle(); }
  // Tıklanan temizle butonunun üzerindeki data-temizle değerini alıp tumunuTemizle fonksiyonuna gönderiyorsun.
});

arama.addEventListener("input", debounce((e) => {
  aramaAyarla(e.target.value);
}, 300));// 0 olarak tanımlayınca (debouncenin olmadığı senaryonun simülasyonu için 0 denedim) her klayve basışında veri gönderiyor. API maliyeti gereksiz uçar.

init();
// localStorage.setItem("todo:v1", "{bozuk");



// const t0 = performance.now();
// for (let i = 0; i < 500; i++) {
//   durum.gorevler.push({ id: crypto.randomUUID(), name: "Görev " + i, completed: i % 3 === 0 });
// }

// render(durum);
// console.log(performance.now() - t0);
