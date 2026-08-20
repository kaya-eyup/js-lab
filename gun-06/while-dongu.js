//              while döngüsü


for (let i = 0; i < 10; i++) {
    console.log(i)
};


// break, continue
let i = 10;
while (i <= 20) {
     i++;
    if(i%2==1){continue;}  // o anki while turunu iptal eder
    console.log(i)
   
}
    
 let k = 20;
while (k <= 30) {
     k++;
    if(k%5==0){break;} // şart sağlandığı anda döngüyü bitirir.  
    console.log(k)
   
}
console.log("döngü bitti.")


let a=35
do {   //           döngüyü en az bir defa çağırır.
  
    console.log(a);
    a++;
} while (a < 39);//while(false)