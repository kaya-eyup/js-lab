export function debounce<A extends unknown[]>(  // saracağı şeyin fonksiyon olacağını öğrendi. yoksa apply çağıramaz
  fn: (...args: A) => void,
  delay: number,
) {
  let timerId: number | undefined; // Bu değişken closure sayesinde hafızada asılı kalır // başlangıçta boş olabilir, undefined da eklenmeli.

  return function (this: unknown, ...args: A) {
    clearTimeout(timerId); // Eski sayacı sıfırla // 

    timerId = setTimeout(() => { // dönüş tipi number. 
      fn.apply(this, args); // Gecikme bitince asıl fonksiyonu çalıştır
    }, delay);
  };
}
  const onSearch = debounce((query: string) => console.log(query), 300);
onSearch("phone");
