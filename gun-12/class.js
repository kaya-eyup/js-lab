//       ES6 ile gelmiştir, constructor üzerine makyaj giydirilimiş halidir. yazımı ve metodları çok daha kolaydır.

// class nasıl yazılır?
class CreatePerson{
    constructor(name, job, position, birthyear) {
        this.name = name;
        this.job = job;
        this.position = position;
        this.birthyear = birthyear;



    }
    findAge() {
        let date = new Date().getFullYear();
        let age = date - this.birthyear; 
        console.log(`The person named ${this.name} is ${age} years old.`)
    }

    get name() {
        return this._name.toUpperCase(); // veriyi dışarı vermeden önce işler.
    }

    // SETTER: Veriyi değiştirmek veya ilk kez atamak istediğimizde devreye girer.
    
 set name(value) {
        // Validation (Doğrulama) noktası!
        if (value.length < 3) {
            console.error("Error: please write your full name!");
            return;
        }
        // Gerçek veriyi '_' ile başlayan "private" kopyaya kaydediyoruz.
        this._name = value; 
    }
}

const p1 = new CreatePerson("john cena", "wrestler", "champion",1977);
const p2 = new CreatePerson("tarkan", "singer", "superstar", 1972);

console.log(p1);
p1.findAge();
console.log(p2.name)


// getter - setter nedir?

//JavaScript'te getter ve setter, nesne özelliklerine (property) erişimi ve değer atamalarını kontrol eden özel metotlardır. Getter (get) bir özelliğin değeri okunurken araya girip işlenmiş veri sunmayı sağlarken, setter (set) ise yeni bir değer atanırken devreye girerek veriyi kontrol etmeye veya filtrelemeye yarar; böylece doğrudan veri değişimini engelleyerek kodun güvenliğini ve doğruluğunu artırırlar.
