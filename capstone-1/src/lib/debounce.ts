export function debounce(fn, delay) {
  let timerId; // Bu değişken closure sayesinde hafızada asılı kalır

  return function (...args) {
    clearTimeout(timerId); // Eski sayacı sıfırla

    timerId = setTimeout(() => {
      fn.apply(this, args); // Gecikme bitince asıl fonksiyonu çalıştır
    }, delay);
  };
}