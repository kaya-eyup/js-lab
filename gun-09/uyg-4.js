const form = document.querySelector("#urun-form");
const liste = document.querySelector("#liste");

const input = form.elements.urun;
// const button = form.elements.button;

function ekleme(e) {
  e.preventDefault();
  const deger = input.value.trim();

  if (!deger) return alert("Lütfen geçerli değer giriniz.");

  const li = document.createElement("li"); // li değişkenini yarattık
    li.textContent = deger; // içine girilen değeri atadık.
    li.classList.add("eleman");
    const silmek = document.createElement("button"); //silme butonu
    silmek.textContent = "X"; // butonun içine çarpı
    silmek.dataset.action = "sil"; // silmek elemanına dataattribute ekledik
    li.appendChild(silmek);  // silme butonunu elemana child olarak ekledik
  liste.appendChild(li); // silme butonuna sahip li değişkenini listeye ekledik

  form.reset();
  input.focus();
}



form.addEventListener("submit", ekleme);

// dikkat et, elemanları listeye ekliyorsun forma değil. sakın karıştırma.

function elemaniSil(s) {



    const libuton = s.target.closest('[data-action="sil"]');  // bu attributeya sahip elemanı libuton'a attık.
    
    if (!libuton) return;  // butona basmadıysan geri dön.
    
    const li = libuton.closest("li");  // closest, üstlerinde li elemanı arar ve bulur
  if (li) {   // butona basınca true oluyor.
    li.remove();
  }

    
}

liste.addEventListener("click", elemaniSil); // dinleyiciyi listeye bağladık

