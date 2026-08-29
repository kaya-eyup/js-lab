//              NESNE TABANLI PROGRAMLAMA

// constructor function

// Constructor (Yapıcı Fonksiyon): Yeni nesneler (instances) üretmek için ana şablon.
function Product(title, description, price, stock) { 
    
    // Properties (Veriler): Üretilen her nesnenin (this) bellekte bağımsız olarak tutacağı özellikler.
    this.title = title;             // Dışarıdan gelen parametreyi, o an üretilen nesnenin bağlamına kilitliyoruz.
    this.description = description;
    this.price = price;
    this.stock = stock;
}

// Methods (Davranışlar): Bellek israfını önlemek için nesne içine değil, şablonun prototipine eklenir.
Product.prototype.display = function () {
    return `Ürün: ${this.title} | Açıklama: ${this.description} | Fiyat: ${this.price} | Stok: ${this.stock}`;
};

Product.prototype.isActive = function () {
    return (this.stock > 0) ? "Stokta var" : "Stokta yok)"
}
// kalıptan türetilen objeler
const product1 = new Product("samsung s25", "pahalı telefon", 35000, 150);
console.log(product1.display());

const product2 = new Product("samsung s7 edge", "ucuz telefon", 7500, 380);
console.log(product2.display());

