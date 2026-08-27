// ===== 1. REFERANSLAR =====       
const liste = document.querySelector("#liste");
const uygulama = document.querySelector("#uygulama");
const yeniGorevInput = document.querySelector("#yeni-gorev");
const bilgi = document.querySelector("#bilgi");



// ===== 2. DURUM =====
const durum = {
  gorevler: [
    { id: 1, name: "süt al", completed: false },
    { id: 2, name: "kod yaz", completed: true },
    { id: 3, name: "senior ol", completed: false },
        { id: 4, name: "ekonomik özgürlüğünü kazan", completed: false },
    
  ], filtre: "hepsi", // Başlangıç filtresi: "hepsi" | "bitmemis" | "bitmis
};


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
// ===== 3. ÇİZİM =====
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

  // 3. Sadece filtrelenmiş görevleri ekrana çiz
  for (const gorev of gorunecekGorevler) {
    const liElement = createItem(gorev);
    liste.appendChild(liElement);
  }

  // 4. Bilgi Mesajı & Kenar Durum Yönetimi
  const toplamGorev = durum.gorevler.length;
  const kalanGorev = durum.gorevler.filter((g) => !g.completed).length;

  if (toplamGorev === 0) {
    bilgi.textContent = "Hiç göreviniz yok.";
  } else if (gorunecekGorevler.length === 0) {
    bilgi.textContent = "Bu filtreye uygun görev bulunamadı.";
  } else {
    bilgi.textContent = `${kalanGorev} tamamlanmamış göreviniz var.`;
  }

  // 5. Filtre Butonlarının Aktiflik Durumunu Güncelle
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


render(durum);




// ===== 4. EYLEMLER =====




function gorevEkle(metin) {
  const temizMetin = metin.trim();
  if (!temizMetin) return; // Boşluk kontrolü temiz metinle yapılır

  const yeniGorev = {
    id: Date.now(),      // Benzersiz id
    name: temizMetin,      // Dışarıdan gelen metin
    completed: false
  };

  durum.gorevler.push(yeniGorev);
    render(durum);
     yeniGorevInput.value = "";
}
   



function gorevSil(id) {
  // durum.gorevler dizisini filtrele: ID'si gelen id'ye EŞİT OLMAYANLARI tut
  durum.gorevler = durum.gorevler.filter(g => g.id !== id);

  // Hafıza güncellendi, ekranı yeniden çiz
  render(durum);
}









function tamamlandiDegistir(id) {
// durum.gorevler dizisinde bul: ID'si gelen id'ye EŞİT OLANLARI tut
    const gorev = durum.gorevler.find(t => t.id === id);
gorev.completed = !gorev.completed;     // dizideki nesne DE değişti — geri atamaya gerek yok

// Hafıza güncellendi, ekranı yeniden çiz
  render(durum);

 }

 // ===== 4. EYLEMLER =====

// Gelen yeni filtre adını ("hepsi", "bitmemis", "bitmis") hafızaya kaydeder
function filtreAyarla(yeniFiltre) {
  durum.filtre = yeniFiltre; // Hafızadaki filtreyi güncelle
  render(durum);             // Yeni filtreye göre ekranı tekrar çiz
}

// Tüm görev listesini sıfırlar
function tumunuTemizle() {
  durum.gorevler = [];       // Diziyi tamamen boşalt
  render(durum);             // Boş listeyi ekrana yansıt
}








// ===== 5. OLAYLAR =====
// uygulama.addEventListener("click", (e) => {
//     const hedefEleman = e.target.dataset.action;
//     if (!hedefEleman) return;

//     const li = e.target.closest("li");
//     const id = li ? Number(li.dataset.id) : null;

//     console.log("eylem:", hedefEleman, "| id:", id)
// });
// ekleButon.addEventListener("click", () => { // ekle butonuna dinleyiciyi ekle.
//   gorevEkle(yeniGorevInput.value);
// });

// liste.addEventListener("click", (e) => {
//   // 1. Tıklanan şeyin dataset.action değeri "sil" mi?
//   if (e.target.dataset.action === "sil") {
//     // 2. Tıklanan butonun en yakınındaki <li> elemanını bul
//     const li = e.target.closest("li");
    
//     // 3. li'nin dataset.id değerini al ve sayıya çevir
//     const id = Number(li.dataset.id);

//     // 4. Saf eylem fonksiyonumuzu çağır!
//     gorevSil(id);
//   }
// });


// liste.addEventListener("click", (e) => {
//   // 1. Tıklanan şeyin dataset.action değeri "degistir" mi?
//   if (e.target.dataset.action === "degistir") {
//     // 2. Tıklanan butonun en yakınındaki <li> elemanını bul
//     const li = e.target.closest("li");
    
//     // 3. li'nin dataset.id değerini al ve sayıya çevir
//     const id = Number(li.dataset.id);

//     // 4. Saf eylem fonksiyonumuzu çağır!
//     tamamlandiDegistir(id);
//   }
// });

uygulama.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  const li = e.target.closest("li");
  const id = li ? Number(li.dataset.id) : null;

  // Konsola anlık işlem dökümü (Debug için)
  console.log("Tıklanan Eylem:", action, "| Görev ID:", id);  
    
  if (action === "sil")       gorevSil(id);
  if (action === "degistir")  tamamlandiDegistir(id);
  if (action === "ekle") gorevEkle(yeniGorevInput.value);
  if (action === "filtre") {
    const filtreTipi = e.target.dataset.filtre;
    console.log("Seçilen Filtre:", filtreTipi);
     filtreAyarla(filtreTipi);
  }

  if (action === "temizle") {tumunuTemizle();}
});