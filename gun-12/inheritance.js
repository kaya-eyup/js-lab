// parent class
class Person {
  constructor(name, birthYear) {
    this.name = name;
    this.birthYear = birthYear;
  }

  calculateAge() {
    let date = new Date().getFullYear();
    let age = date - this.birthYear;
    console.log(`The person named ${this.name} is ${age} years old.`);
  }
  identifyYourself() {
    console.log(`My name is ${this.name}`);
  }
}

// child class
// extends kelimesi, Person'un tüm özelliklerini ve metotlarını Student'a referans ile bağlar.
class Student extends Person {
  constructor(name, birthYear, id) {
    // super(): Parent sınıfın constructor'ını tetikler.
    // Bu çağrılmadan child içinde 'this' KULLANILAMAZ!
    super(name, birthYear);

    // Sadece Student'a özel olan yeni özellikler
    this.id = id;
  }

  study() {
    console.log(`${this.name} has to study.`);
  }

  identifyYourself() {
    console.log(`My name is ${this.name} and my school number is ${this.id}`);
  }
}
// child class
// extends kelimesi, Person'un tüm özelliklerini ve metotlarını Teacher'a referans ile bağlar.
class Teacher extends Person {
  constructor(name, birthYear, profession) {
    // super(): Parent sınıfın constructor'ını tetikler.
    // Bu çağrılmadan child içinde 'this' KULLANILAMAZ!
    super(name, birthYear);
    // Sadece Teacher'a özel olan yeni özellikler
    this.profession = profession;
  }

  teach() {
    console.log(`Mr./Mrs.${this.name} has to teach.`);
  }

  identifyYourself() {
    console.log(
      `I'm Mr./Mrs.${this.name} and my profession is ${this.profession}`,
    );
  }
}

let p1 = new Person("Ali", 2000);

p1.calculateAge();
p1.identifyYourself();

let s1 = new Student("John", 2015, 12345);
console.log(s1);
s1.calculateAge();
let s2 = new Student("Wei", 2013, 88776);
console.log(s2);
s2.identifyYourself();
s2.study();

let t1 = new Teacher("White", 1980, "Chemistry");
console.log(t1);
t1.identifyYourself();
