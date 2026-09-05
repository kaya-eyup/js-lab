export function updateList(container, items) {
    // 1) mevcut kartları kimliğe göre topla
  const existing = new Map();
  for (const card of container.children) {
    existing.set(card.dataset.id, card);
  }

  // 2) items sırasında dolaş
  for (const item of items) {
    const key = String(item.id);
    let card = existing.get(key);

    if (card) {
        existing.delete(key);   // ??? bu satır neden gerekli
        //Harita başlangıçta ekrandaki tüm eski kartları tutar. Yeni listede eşleşen her kartı haritadan silersin (delete). Döngü bittiğinde haritada yalnızca yeni listede artık var olmayan (silinmesi gereken) kartlar kalır. 3. adımda
    } else {
      card = createCard();
      card.dataset.id = key;
    }

      // ??? kartın yazılarını güncelle (h3, p)
      card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = "$" + item.price;

    container.appendChild(card);   // varsa taşır, yeniyse ekler
  }

    // 3) haritada kalanları sil
    for (const unusedCard of existing.values()) {
    unusedCard.remove();
  }
  // ??? artık listede olmayan kartlar burada
}

function createCard() {
  const div = document.createElement("div");
  div.className = "card";
  // innerHTML burada sadece iskeleti bir kez kurarken çalışır.
  div.innerHTML = `
    <h3></h3>
    <p></p>
    <input type="number" class="qty" min="0" placeholder="adet">
  `;
  return div;
}    


// aşama d sağlamaları başarıyla tamamlandı..