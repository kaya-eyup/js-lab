const eleman = document.querySelector("#mesaj")
const button = document.querySelector("button")
const buttonContainer = document.querySelector("#buttons")




function mesajGoster() {        
    console.log(eleman.value); 
    eleman.value = "";
}

button.addEventListener("click", mesajGoster) // solda istenen olay, sağda fonksiyonun referansı. butona olayı ekledik.


for (let i = 1; i <= 5; i++) {
    let button = document.createElement("button");
    button.id = "btn" + i;
    button.textContent = `Buton ${i}`;
    button.addEventListener("click", mesajGoster);
    buttonContainer.appendChild(button);
}


document.getElementById("btn1").removeEventListener("click", mesajGoster) // eventi kaldırdık.
// KALDIRMA İŞLEMİ REFERANS İLE YAPILIR. ELEMANI DOM'dan KOPARIP ONA BAĞLI DİNLEYİCİYİ DE KALDIRMAZ İSEN MEMORY LEAK OLUR.