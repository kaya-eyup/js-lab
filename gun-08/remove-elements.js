function clearHeader() {
    const h1 = document.querySelector("h1"); // h1 tagini seçtik
    h1.remove();        // konumlandığın elemanı siler.
}

//clearHeader();

function removeItem1() {
    // const firstItem = document.querySelector("li:first-child"); // parent üzerinden ulaşabilirsin.
    // firstItem.remove();

    const ul = document.querySelector("ul");
    const lastItem = document.querySelector("li:last-child"); 
    ul.removeChild(lastItem)

}

//removeItem1();


function removeItem2(number) {
    const ul = document.querySelector("ul");
    const eleman = document.querySelector(`li:nth-child(${number})`)

    ul.removeChild(eleman)
}

//removeItem2(2) // 2 numaralı elemanı sil.


function removeAll() {
     const ul = document.querySelector("ul");
     ul.innerHTML = ""

    
}
removeAll();
