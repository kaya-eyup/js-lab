let sonuc;

// sonuc = document.getElementsByClassName("item");
// sonuc = document.getElementsByClassName("item")[0];

// const items  = document.getElementsByClassName("item");

// const grup2 = document.getElementById("grup1")
// const items  = grup2.getElementsByTagName("li"); // etikete göre çeker.

// const items = document.querySelectorAll("li");
const items = document.querySelectorAll("#grup1 .item"); // grup1 idsi altındaki item classına sahip olanlar.


// for (let i = 0; i < items.length; i++) {
//     const eleman = items[i];
//     console.log(eleman);
// }

for (const item of items) {
    item.style.color = "yellow"
    item.style.fontSize = "20px"
    item.innerText = "selamlar"


}
 console.log(items);