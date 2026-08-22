// js-lab/gun-07/veri.js
// Gün 7 — konsolidasyon veri seti.
// Bu veri KASITLI olarak bozuktur. Gerçek bir API'den gelen veri de böyledir.
// Sadece 8 kayıt var: her sonucu elle doğrulayabilmen için.

export const hamVeri = [
  {
    id: "SIP-1001",
    musteri: { id: 7, ad: "  ayşe YILMAZ ", sehir: "İzmir" },
    durum: "teslim edildi",
    tarih: "2026-08-01",
    kalemler: [
      { urun: "Klavye", kategori: "elektronik", fiyat: 850, adet: 1 },
      { urun: "Mouse", kategori: "Elektronik", fiyat: "450", adet: 2 },
    ],
  },
  { 
    id: "SIP-1002",
    musteri: { id: 12, ad: "Mehmet Demir", sehir: "izmir" },
    durum: "kargoda",
    tarih: "2026-08-03",
    kalemler: [
      { urun: "Kitap", kategori: "kitap", fiyat: 120, adet: 3 },
      { urun: "Defter", kategori: "Kırtasiye", fiyat: 45, adet: 2 },
    ],
  },
  {
    id: "SIP-1003",
    musteri: { id: 7, ad: "Ayşe Yılmaz", sehir: "İZMİR" },
    durum: "iptal",
    tarih: "2026-08-05",
    kalemler: [{ urun: "Monitör", kategori: "elektronik", fiyat: 4200, adet: 1 }],
  },
  {
    id: "SIP-1004",
    musteri: { id: 31, ad: "Zeynep Kaya", sehir: "Ankara" },
    durum: "teslim edildi",
    tarih: "2026-08-06",
    kalemler: [
      { urun: "Kulaklık", kategori: "elektronik", fiyat: 1250, adet: 1 },
      { urun: "Kitap", kategori: "kitap", fiyat: 120, adet: 1 },
      { urun: "Kalem", kategori: "kırtasiye", fiyat: 25, adet: "3" },
    ],
  },
  {
    id: "SIP-1005",
    musteri: null,
    durum: "teslim edildi",
    tarih: "2026-08-07",
    kalemler: [{ urun: "Mouse", kategori: "elektronik", fiyat: 450, adet: 1 }],
  },
  {
    // SIP-1002 ikinci kez geliyor — aynı içerik, FARKLI nesne (farklı referans)
    id: "SIP-1002",
    musteri: { id: 12, ad: "Mehmet Demir", sehir: "izmir" },
    durum: "kargoda",
    tarih: "2026-08-03",
    kalemler: [
      { urun: "Kitap", kategori: "kitap", fiyat: 120, adet: 3 },
      { urun: "Defter", kategori: "Kırtasiye", fiyat: 45, adet: 2 },
    ],
  },
  {
    id: "SIP-1006",
    musteri: { id: 31, ad: "zeynep kaya", sehir: "ankara" },
    durum: "İptal",
    tarih: null,
    kalemler: [],
  },
  {
    id: "SIP-1007",
    musteri: { id: 44, ad: "Ali Vural", sehir: "Bursa" },
    durum: "teslim edildi",
    tarih: "2026-08-09",
    kalemler: [
      { urun: "Sandalye", kategori: "mobilya", fiyat: 3100, adet: 1 },
      { urun: "Masa", kategori: "mobilya", fiyat: null, adet: 1 },
    ],
  },
];
