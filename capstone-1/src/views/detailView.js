export function detailView(state) {
  const { id } = state.route.params;

  return `
    <div class="detail">
      <a href="/">← Listeye dön</a>
      <h1>Ürün ${id}</h1>
      <p>(veri Gün 18'de)</p>
    </div>
  `;
}