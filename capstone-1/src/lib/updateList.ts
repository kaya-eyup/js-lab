import { getElement } from "./dom.ts";
import type { ProductSummary} from "../api/products.ts"
export function updateList(container: HTMLElement, items: ProductSummary[]): void {
  const existing = new Map<string, HTMLElement>();

  for (const card of container.children) {
    if (!(card instanceof HTMLElement)) continue;
    const id = card.dataset.id;
    if (!id) continue;

    existing.set(id, card);
  }

  for (const item of items) {
    const key = String(item.id);
    let card = existing.get(key);

    if (card) {
      existing.delete(key); // ??? bu satır neden gerekli

      //Harita başlangıçta ekrandaki tüm eski kartları tutar. Yeni listede eşleşen her kartı haritadan silersin (delete). Döngü bittiğinde haritada yalnızca yeni listede artık var olmayan (silinmesi gereken) kartlar kalır.
    } else {
      card = createCard();
      card.dataset.id = key;
    }

    const titleEl = getElement(card, "h3", HTMLHeadingElement);
    const priceEl = getElement(card, "p", HTMLParagraphElement);

    titleEl.textContent = item.title;
    priceEl.textContent = `$${item.price}`;

    container.appendChild(card);
  }

  for (const unusedCard of existing.values()) {
    unusedCard.remove();
  }
}

function createCard(): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <h3></h3>
    <p></p>
    <input type="number" class="qty" min="0" placeholder="adet">
  `;
  return div;
}
