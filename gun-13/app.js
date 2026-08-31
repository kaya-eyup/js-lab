// log için : fetch'in reddetmesi "istek başarısız" demek değil, "istek gönderilemedi" demektir. Sunucuya ulaşıldıysa fetch işini yapmıştır — cevabın içeriği onun sorunu değil.

// ── 0. REFERANSLAR ────────────────────
const input = document.querySelector("#search");
const output = document.querySelector("#output");

// fetch("https://countries.dev/name/turkey")

//     .then((answer) => answer.json())
//     .then((data) => console.log(data));                   //       dizi basar? dizi içinde obje şeklinde propertyler
// console.log(fetch("https://countries.dev/name/turkey"));  //        bilmiyorum. promise olayının durumunu yazdırdı. denemek için bozdum, rejected yazdırdı. fetch'in başarı durumunu yazdırıyor

// ── 1. DURUM ────────────────────────────

let state = {
  screen: "idle", // "empty" | "loading" | "error" | "success"
  matches: [],
  neighbors: [],
  error: "",
};

// ── 2. API KATMANI ──────────────────────  ← BUGÜNÜN YENİ KISMI

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function ulkeyiGetir(name) {
    
//   // 1. fetch işlemini doğrudan RETURN ediyoruz (böylece dışarıda .then kullanılabilir)
//   return fetch(`https://countries.dev/name/${name}`)
    // GEÇİCİ — yarışı görmek için, sonra silinecek
const fakeDelay = name.length < 5 ? 3000 : 0;
return sleep(fakeDelay).then(() => fetch(`https://countries.dev/name/${name}`))
    .then((answer) => {
    // 1. HTTP durumu 200-299 aralığında değilse (örn: 404 veya 500)
    if (!answer.ok) {
      throw new Error(`Ülke bulunamadı`);
    }
    return answer.json();
  });
}

// ── 3. RENDER ───────────────────────────
// render() — durum.ekran'a bakar, dördünden birini çizer

function render() {
  output.innerHTML = "";

  if (state.screen === "idle") {
    const msg = document.createElement("p");
    msg.className = "text-center text-muted fs-5 mt-5";
    msg.textContent = "Arama yapın.";
    output.appendChild(msg);
    return;
  }
  if (state.screen === "loading") {
    const msg = document.createElement("p");
    msg.className = "text-center text-muted";
    msg.textContent = "Aranıyor...";
    output.appendChild(msg);
    return;
  }
  if (state.screen === "error") {
    const msg = document.createElement("p");
    msg.className = "text-center text-danger fw-bold";
    msg.textContent = state.error;
    output.appendChild(msg);
    return;
  }
  if (state.screen === "empty") {
    const msg = document.createElement("p");
    msg.className = "text-center text-warning fw-bold";
    msg.textContent = "Sonuç bulunamadı";
    output.appendChild(msg);
    return;
  }

  // buraya gelindiyse

  const list = document.createElement("ul");
  list.className = "country-list row g-4 list-unstyled";

  state.matches.forEach((country) => {
    list.appendChild(createCountryCard(country));
  });

  output.appendChild(list);
}

function createCountryCard(country) {
  // 1. Liste Elemanı
  const li = document.createElement("li");
  li.className = "card col-md-6 col-lg-4 shadow-sm border-0 h-100 p-4";

  // 2. İçerik
  const img = document.createElement("img");
  const name = document.createElement("h2");
  const capital = document.createElement("p");
  const population = document.createElement("p");
  const borders = document.createElement("p");
  
  img.src = country.flags?.svg || country.flags?.png || "";
  img.alt = country.name;
  img.className = "d-block mb-3 w-100";
  img.style.height = "200px";
  img.style.objectFit = "cover";
  name.textContent = country.name;
  name.className = "h5 text-primary fw-bold text-center mb-3";
  capital.textContent = country.capital;
  capital.className = "text-muted small mb-2";
  population.textContent = country.population;
  population.className = "text-muted small mb-2";
  borders.textContent =  country.borders?.join(", ") || "No neighbor";
  borders.className = "text-muted small mt-3 pt-3 border-top";

  li.appendChild(img);
  li.appendChild(name);
  li.appendChild(capital);
  li.appendChild(population);
  li.appendChild(borders);

  // Üretilen tekil elemanı geriye dön
  return li;
}

// ── 4. EYLEMLER ─────────────────────────







let idSayaci = 0; // her çağrıda sıfırlanmasın diye dışarda
function search(name) {
  // önce kontrol
  if (name.trim() === "") {
    state.screen = "idle";
    render();
    return;
    }
    
    // sonra diğerleri
    
    const istekId = ++idSayaci;

  state.screen = "loading"; // ← 1. an
  render();
  ulkeyiGetir(name)
      .then((list) => {
          if (istekId !== idSayaci) return;
      state.matches = list;
      state.screen = list.length === 0 ? "empty" : "success"; // ← 2. an
      render();
    })
      .catch((err) => {
        if (istekId !== idSayaci) return;
      state.error = err.message;
      state.screen = "error"; // ← 3. an
      render();
    });
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
}

// ── 5. DİNLEYİCİLER ─────────────────────
// input + debounce (Gün 10'da yazdığın)

input.addEventListener(
  "input",
  debounce((e) => {
    search(e.target.value);
  }, 400),
);

render();

// ── 6. init() ───────────────────────────
