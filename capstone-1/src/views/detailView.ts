export function detailView(id : string): string {
  return `
    <div class="detail">
      <a href="/">← Listeye dön</a>
      <h1>Ürün ${id}</h1>
      <p>(veri Gün 18'de)</p>
    </div>
  `;
}