// const result = navigator.geolocation.getCurrentPosition(
//   (position) => console.log("konum geldi:", position.coords.latitude, position.coords.longitude),
//   (error) => console.log("hata:", error.message)
// );

// console.log(result);
// console.log("bu satir calisti");


function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Başarılı ise resolve fonksiyonunu çağır ve koordinatları dön
            const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            resolve(coords);
        },

        (error) => {
        // Hata oluştuysa (örn: kullanıcı izin vermedi) reject fonksiyonunu çağır
            reject( error);
            resolve({ latitude: 0, longitude: 0 });   // hemen ardından
        }
        
    );
  });
}

try {
  const position = await getPosition();
  console.log(position.latitude, position.longitude);
} catch (error) {
  console.log(error.message);
}