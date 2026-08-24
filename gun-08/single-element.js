//                   tekli element seçimi, 
//                  getElementBy id,class,attribute vs.


let sonuc;

//                  document.getElementById("") => id'ye göre alır.


// sonuc = document.getElementById("title");
// sonuc = document.getElementById("title").id;  // idsini yazdırır
// sonuc = document.getElementById("title").className; // sahip olduğu classlardan birini getirir
// sonuc = document.getElementById("title").classList; // sahip olduğu classları listeler

// document.getElementById("title").style.fontSize= "52px"; // stilini etkiledik.

// document.getElementById("title").style.color= "red"; // cssi manipüle edebilirsin.
 
// // document.getElementById("title").style.display= "none"; // manipülasyon.

// document.getElementById("title").innerText= "Alışveriş Listesi"; // sadece texti etkiledi.
// document.getElementById("title").innerHTML= "<p>Alışveriş Listesi</p>"; // innerHTML ile etiketini manipüle ettik

//                 document.querySelector() => id, classi elementName

sonuc = document.querySelector("#title");   // id seçici
sonuc = document.querySelector(".app-title");   // class seçici
sonuc = document.querySelector("h1");   //  etiket seçici, ilk bulduğunu getirir.
sonuc = document.querySelectorAll("h1");   //  etiket seçici, bütün etiketleri getirir

sonuc = document.querySelector("input[type='submit']");   //  tipine göre getirdin.

sonuc = document.querySelector("h1");   //  etiket seçici, ilk bulduğunu getirir.
sonuc = document.querySelector("li:nth-child(2)");   // listede istediğin numaralı elemanı getirir.
sonuc = document.querySelector("li:nth-child(3)").innerText = "içerik 3";   // listede istediğin numaralı elemanı manipüle edebilirsin


sonuc = document.querySelector("li:nth-child(3)").style.color = "blue";   // listede istediğin numaralı elemanı manipüle edebilirsin




const parentElement = document.querySelector("ul");
console.log(parentElement)
const firstElement = parentElement.querySelector("li")
firstElement.style.color = "green";
console.log(sonuc);