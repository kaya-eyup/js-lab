import { hamVeri } from "./veri.js";

// Geçersiz sayı bilgisi 0 değildir: 0 gerçek bir değerdir, null ise eksik/veri hatasıdır.
function sayiyaCevir(deger) {
  if (deger === null || deger === undefined) return null;
  if (typeof deger === "string" && deger.trim() === "") return null;

  const sayi = Number(deger);
  return Number.isFinite(sayi) ? sayi : null;
}

function metinNormalize(deger) {
  if (typeof deger !== "string" || deger.trim() === "") return null;
  return deger.trim().toLocaleLowerCase("tr-TR");
}

function musteriNormalize(musteri) {
  if (musteri === null || musteri === undefined) return null;

  return {
    ...musteri,
    ad: metinNormalize(musteri.ad),
    sehir: metinNormalize(musteri.sehir),
  };
}

function kalemNormalize(kalem) {
  const fiyat = sayiyaCevir(kalem.fiyat);
  const adet = sayiyaCevir(kalem.adet);
  const satirToplami = fiyat === null || adet === null ? null : fiyat * adet;

  return {
    ...kalem,
    kategori: metinNormalize(kalem.kategori),
    fiyat,
    adet,
    satirToplami,
  };
}

// Ham veriden raporlamaya hazır tek bir kanonik biçim üret.
function siparisNormalize(siparis) {
  return {
    ...siparis,
    musteri: musteriNormalize(siparis.musteri),
    durum: metinNormalize(siparis.durum),
    kalemler: siparis.kalemler.map(kalemNormalize),
  };
}

function tekillestirme(dizi, anahtarFn) {
  const defter = new Map();

    dizi.forEach(eleman => {
    const anahtar = anahtarFn(eleman);
    if (!defter.has(anahtar)) defter.set(anahtar, eleman);
    });

  return [...defter.values()];
}


function siparisToplami(siparis) {
  return siparis.kalemler
    .map(k => k.satirToplami)
    .filter(t => t !== null)
    .reduce((toplam, t) => toplam + t, 0);
}

function ortalama(dizi) {
  if (dizi.length === 0) return null;
  return dizi.reduce((toplam, deger) => toplam + deger, 0) / dizi.length;
}

function grupla(dizi, anahtarFn) {
  const defter = new Map();

    dizi.forEach(eleman => {
    const anahtar = anahtarFn(eleman);
        if (!defter.has(anahtar)) { defter.set(anahtar, [eleman]) }
        else {defter.get(anahtar).push(eleman)}
    });

    return defter;
}

// Tek hat: normalize et -> id'ye göre ilk kaydı koruyarak tekilleştir -> raporla.
const temizSiparisler = hamVeri.map(siparisNormalize);

const tekilSiparisler = tekillestirme(temizSiparisler, (siparis) => siparis.id);

const gecerli = tekilSiparisler.filter(d => d.durum!= "iptal")

const toplamli = gecerli.map(s => ({ ...s, toplam: siparisToplami(s) }));

const sehirMap = grupla(toplamli, s => s.musteri?.sehir ?? "bilinmiyor");

const sehirler = [...sehirMap.entries()].map(([sehir, siparisler]) => ({
  sehir,
  siparisSayisi: siparisler.length,
  ciro:         siparisler.reduce((acc, para) => acc+para.toplam, 0) ,
    ortalamaSepet: ortalama(siparisler.map(s=> s.toplam))
}));



console.log("Temiz siparişler:", temizSiparisler);
console.log("Tekil sipariş sayısı:", tekilSiparisler.length);
console.log("Geçerli siparişler:",gecerli);   // 5
console.log("sipariş başınatoplam ücret hesaplanmış:",toplamli);    // 
console.log("SIP-1001 toplamı:", siparisToplami(tekilSiparisler[0]));
console.log("Şehirlere göre ciro ve ortalama", sehirler)
