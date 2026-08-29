//              prototypes



// constructor function

function Comment(title, body, username) {
// State / Properties (Her nesne için bellekte bağımsız olarak yeniden oluşturulur)
    this.title = title;
    this.body = body;
    this.username = username;
    this.createdAt = Date.now();
    
    console.log(this) // o çağrıda constructoru kullanarak oluşturulan nesneyi gösterir.
}


// Prototype / Metotlar (Bellekte SADECE 1 KEZ oluşturulur), eğer constructorun içine atsaydın kullanmasaydın bile her seferinde yeniden oluşturulup belleği gereksiz yorardı.
Comment.prototype.display = function () {  // prototipin içine attın.
    return this.body;
}

const c1 = new Comment("güzel insan", "ben güzel bir insanım", "güzelİnsan123"); 
const c2 = new Comment("kötü insan", "ben kötü bir insanım", "kötüİnsan123");
 

console.log(c1.display());
console.log(c2.display());   

