// export edilecek özel hata sınıfımız
export class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = "HttpError";        // konsolda ve loglarda ayırt edilir
    this.status = response.status;  // çağıran bununla dallanır
    this.url = response.url;        // hangi istek patladı — loglama için
    }
    // Kullanıcıya gösterilecek temiz mesajı üreten getter
    get userMessage() {
    if (this.status === 404) return "Aradığınız kayıt bulunamadı.";
    if (this.status === 401 || this.status === 403) return "Bu işlem için yetkiniz yok.";
    if (this.status >= 500) return "Sunucu kaynaklı bir sorun oluştu, lütfen sonra tekrar deneyin.";
    return "Beklenmeyen bir ağ hatası oluştu.";
  }
}


// export edilecek fetch fonksiyonumuz
export function http(url,options = {}) {
    return fetch(url, options).then((response) => {
        if (!response.ok) {
            // Düz Error yerine zengin veriye sahip özel hatamızı fırlatıyoruz:
            throw new HttpError(response);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json();
        }

        return response.text().then((text) => {
            throw new Error(`Beklenen JSON yerine farklı tip geldi (${contentType}): ${text.slice(0, 100)}`);
        });
    });
}


