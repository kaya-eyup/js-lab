//              Object properties


function Rectangle(name, width, height) {
    this.name = name;
    this.width = width;
    this.height = height;
        
        this.area = width * height;
        console.log(`${name} adlı şeklinizin alanı ${this.area}`);


};

const rect1 = new Rectangle("abc", 12, 15);

const rect2 = new Rectangle("xyz", 9, 13);



rect1.color = "red" // değişkene özel property eklenebilir

delete rect1.color;  // propertyi silebilirsin

// console.log(rect1.hasOwnProperty("color")); // color adında bi property var mı? true/false döndürür

rect2.cevre = function() {
    const cevresi = (2 * (this.height + this.width));
    return `${this.name} adlı şeklinizin çevresi: ${cevresi}`
}

console.log(rect1);
console.log(rect2.cevre());



// get keys

console.log(Object.keys(rect1)); // keyleri getir

// get values

console.log(Object.values(rect1));  // valueları getir


// get entities 
console.log(Object.entries(rect1)); // ikisini de getirS