TypeScript'te kodun sadece çalışması yetmez; uygulamanın hatalı bir state'e düşmesinin derleme (compile) aşamasında imkansız hale getirilmesi gerekir. Bugünün konseptleri, frontend mimarisinde state ve veri yönetimini kurşun geçirmez yapmanın endüstri standartlarıdır.

Interface ve Type (Veri Kontratları)

Nedir: Obje ve fonksiyonların nasıl görünmesi gerektiğini (shape) tanımlayan yapılardır.

Senior Yaklaşımı: Her ikisi de obje tanımlayabilir ancak tasarım felsefeleri farklıdır. Interface, açık uçlu ve miras alınabilir (extend) kontratlar içindir. Veritabanı modelleri, dışarıdan gelen API yanıtları veya class'ların uygulayacağı (implement) şablonlarda standart tercihtir. Type ise statik ve kapalıdır; tipik olarak union/intersection gibi matematiksel tip operasyonları yaparken veya spesifik varyasyonlar oluştururken kullanılır.

Union (|) ve Literal Tipler

Nedir: Bir değişkenin sınırsız bir evren yerine, sadece senin belirlediğin kesin değerlerden birini alabilmesidir.

Ne İşe Yarar: Tip tanımını string yapmak yerine type Size = 'small' | 'medium' | 'large' dediğinde, sisteme yanlışlıkla 'xl' veya typo içeren bir değerin girilmesi imkansızlaşır. Projedeki belirsiz metin (magic string) hatalarını bitirir ve IDE'nin sana eksiksiz otomatik tamamlama sunmasını sağlar.

Tip Daraltma (Narrowing) ve Type Guards

Nedir: Belirsiz (örn. string | number veya unknown) bir verinin, if/switch bloklarıyla filtrelenerek kodun ilerleyen satırlarında kesin bir tipe dönüştürülmesidir. TypeScript senin kontrol mantığını okuyarak tipi güvenli hale getirir.

Araçları:

typeof: Primitive değerleri (string, number, boolean vb.) daraltır.

in: Bir objenin içinde belirli bir anahtar kelimenin (property) olup olmadığını sorgular.

instanceof: Değerin belirli bir Class'ın kopyası olup olmadığına bakar.

x is Y (Custom Guard): En güçlü olanıdır. TypeScript'in otomatik anlayamadığı karmaşık doğrulama fonksiyonlarında, derleyiciye "bu fonksiyon true dönerse, girdiğim veri kesinlikle şu tiptir" garantisini manuel olarak vermeni sağlar.

Discriminated Union (Durum Makinesi Mantığı)

Nedir: Farklı obje tiplerini, hepsinde ortak olarak bulunan tek bir "etiket" (literal tip, genelde type, status veya kind ismindedir) üzerinden gruplamaktır.

Sektördeki Değeri: Fetch işlemlerinde isLoading, isError, isSuccess gibi 3 farklı boolean state tutarsan, teknik olarak 8 farklı kombinasyon oluşur. Sistem aynı anda hem yükleniyor hem de hata almış gibi imkansız, bug'lı durumlar (impossible states) yaratabilir. Discriminated union ile ortak bir status anahtarı ('idle' | 'loading' | 'success' | 'error') tanımlarsın. Kodda if (state.status === 'success') dediğin anda TypeScript sadece başarılı verinin (data) erişilebilir olduğuna, yüklenme durumunun veya hatanın teknik olarak hafızada var olamayacağına emin olur.