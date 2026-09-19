export function notFoundView(): string {
  return `
    <div class="not-found">
      <h1>404 - Sayfa Bulunamadı</h1>
      <p>Aradığınız sayfa mevcut değil.</p>
      <a href="/">Listeye dön</a>
    </div>
  `;
}