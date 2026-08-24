function replaceItem1() {
    const firstItem = document.querySelector("li:first-child");

    const li = document.createElement("li");
    li.textContent = "güncellendi."
    
    firstItem.replaceWith(li);
}
 
replaceItem1();



function replaceItem2() {
    const secondItem = document.querySelector("li:nth-child(2)");

    //  secondItem.innerHTML = "tekrardan güncellendi."        // elementin sadece içini günceller.
    secondItem.outerHTML = "<li>tekrardan güncellendi.</li>"   // elementin parentini de güncellemelisin.
    
}

replaceItem2();



function replaceAllitems() {
    const items = document.querySelectorAll("li");

    for (let i = 0; i < items.length; i++) {
        items[i].innerHTML = "replaced." // outer veya text ile istediğin şekilde etkileyebilirsin.
        if (i == 1) {
            items[i].innerHTML = "second item"
        }
    }
}

replaceAllitems();