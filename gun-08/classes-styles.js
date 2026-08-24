 const h1 = document.querySelector("h1");
const button = document.querySelector("button");
const items = document.querySelectorAll(".items li");

function fn() {
    console.log(h1.className);
    console.log(h1.classList);
    // h1.className = "title f30"
    // h1.classList.add("coolerTitle")
    // h1.classList.remove("f20");
    // h1.classList.toggle("coolerTitle") // toggle var ise siler, yok ise ekler.
    // h1.classList.toggle("f20")         // toggle var ise siler, yok ise ekler.
    // h1.classList.replace("f20", "f30");  // soldakini sağdaki ile replace et.


    for (let i = 0; i < items.length; i++) {
        items[i].classList.add("active");
        
    }
}


button.addEventListener("click", fn);