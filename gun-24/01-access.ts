export {};
// ===== Bölüm 1 — BankAccount (TS kelimeleri) + SavingsAccount: derleyici neyi yasaklıyor =====

//     Kural    |            Kim erişebilir                              | TS kelimesi
// Herkes	             dışarısı, sınıfın içi, alt sınıf	               public (varsayılan budur)
// Aile	                 sınıfın içi ve ondan türeyen sınıflar	           protected
// Sadece ben	         yalnızca sınıfın kendi içi	                       private
// Kimse değiştiremez	 okumak serbest, atandıktan sonra yazmak yasak	   readonly (öbür üçüyle birlikte kullanılabilir)

class BankAccount {
  readonly history: number[] = [];
  constructor(
    readonly iban: string,
    private balance: number,
    private pin: string,
  ) {
    this.history.push(this.balance);
  }

  deposit(amount: number): void {
      if (amount <= 0) throw new Error("Invalid Amount");
      this.applyChange(amount);
  }

    withdraw(amount: number, pin: string): void {
        // Negatif veya 0 ile işlem yapılmasını engelle
  if (amount <= 0) {
    throw new Error("Invalid Amount");
  }
    if (this.pin !== pin) {
      throw new Error("Wrong PIN");
    }

    this.applyChange(-amount)
  }
    protected applyChange(delta: number): void{
        if (this.balance + delta < 0) { throw new Error("Insufficient Funds"); }
        this.balance += delta;
      this.history.push(this.balance)
  }
  getBalance(): number {
    return this.balance;
  }
}

const acc = new BankAccount("TR01", 100, "1234");
try {
    acc.withdraw(-1000, "1234")
} catch (err: unknown) {
   if (err instanceof Error) {
       console.log("Failed", err.message);
   }else { throw err; }
 }

 // 1. Successful Deposit
 acc.deposit(50);
 console.log("Deposit 50 -> Balance:", acc.getBalance()); // 150
 // 2. Successful Withdrawal
 acc.withdraw(30, "1234");
 console.log("Withdraw 30 -> Balance:", acc.getBalance()); // 120
 // 3. Balance Getter
 console.log("Current Balance:", acc.getBalance()); // 120
 // 4. Balance History
 console.log("Account History:", acc.history); // [100, 150, 120]
 // 5. Wrong PIN Test
 try {
   acc.withdraw(30, "0000");
 } catch (err: unknown) {
   if (err instanceof Error) {
     console.log("Failed Withdrawal (Wrong PIN):", err.message); // Wrong PIN
   }else { throw err; }
 }
 // 6. Insufficient Funds Test
 try {
   acc.withdraw(500, "1234");
 } catch (err: unknown) {
   if (err instanceof Error) {
     console.log("Failed Withdrawal (Insufficient Funds):", err.message); // Insufficent Funds
   }else { throw err; }
 }
 class SavingsAccount extends BankAccount{
     addInterest(rate: number): void{
        if (rate <= 0) {
      throw new Error("Invalid interest rate");
    }

    // 1. Faiz getirisini hesapla
    const interest = this.getBalance() * rate;

    // 2. Hesaplanan tutarı protected metod üzerinden bakiyeye eklet
    this.applyChange(interest);
         // @ts-expect-error: Property 'pin' is private and only accessible within class 'BankAccount'.
         console.log(this.pin); // private bir sytntactic sugardır. compile sırasında vardır, runtime'da yoktur.
     }
     // @ts-expect-error: Property 'balance' is private and only accessible within class 'BankAccount'.
     breakRule(): void { this.balance += 1; }
 }
 const savings = new SavingsAccount("TR02", 1000, "9999");
 savings.addInterest(0.1);
 savings.getBalance()  //  → 1100
 // @ts-expect-error: Cannot assign to 'iban' because it is a read-only property.
 acc.iban = "TR99";          // 1 // readonly yazdık, hata verir.
 // @ts-expect-error: Property 'balance' is private and only accessible within class 'BankAccount'.
console.log(acc.balance);   // 2 // private, hata.
// @ts-expect-error: Property 'applyChange' is protected and only accessible within class 'BankAccount' and its subclasses.
 console.log(acc.applyChange(5))// protected, sadece ailesi tarafından ulaşılabilir
 // @ts-expect-error: Property 'pin' is private and only accessible within class 'BankAccount'.
 console.log(acc.pin);       // 3 // private, girmemelisin ama girdin uyarısı. kendimizi kandırdık.
 acc.history.push(999);      // 4 // hata vermez zira dizinin readonly dizinin referansını korudu, içeriğini değil.
 console.log(acc["pin"]);    // 5 // kabak gibi basar.
 // 6 → SavingsAccount içindeki console.log(this.pin) //  9999 basar — silinen alan değil erişim kuralı; private çalışma anında iz bırakmaz

 // ===== Bölüm 2 — aynı yasaklar çalışma anında: hangisi gerçekten duruyor =====
 // burda dikkat edilmesi gereken detay: TS derleme zamanında vardır, runtime'da yoktur. orda saf JS'e dönüşür.
 console.log("iban:", acc.iban);         
 console.log("history:", acc.history);   
 console.log("keys:", Object.keys(acc));
 console.log("json:", JSON.stringify(acc));
 console.log("savings:", savings.getBalance(), savings.history);
// hepsi kabak gibi çıkar.
// Kural silindi, atamalar gerçekten yapıldı: iban TR99 oldu, 2b ve 4 geçmişe 125 ve 999 ekledi, json pin'i sızdırıyor.


 // ===== Bölüm 3 — SecureAccount (JS #) + getter: aynı ölçümler =====
 class SecureAccount {
     #history: number[] = [];
     // 1. Hard Private alanlar sınıf gövdesinde bildirilir
     #balance: number;
     #pin: string    
   constructor(
     readonly iban: string,
      balance: number,
      pin: string,
   ) {
       // 2. Özel alanlara atamalar constructor içinde açıkça yapılır
     this.#balance = balance;
     this.#pin = pin;
     this.#history.push(this.#balance);
   }
   deposit(amount: number): void {
     if (amount <= 0) throw new Error("Invalid Amount");
     this.#balance += amount;
     this.#history.push(this.#balance); // Bakiye değiştikçe logluyoruz
   }
   withdraw(amount: number, pin: string): void {
     if (this.#pin !== pin) {
       throw new Error("Wrong PIN");
     }
     if (amount > this.#balance) {
       throw new Error("Insufficient Funds");
       }
      if (amount <= 0) throw new Error("Invalid Amount");
     this.#balance -= amount;
     this.#history.push(this.#balance);
     }
     toJSON(): { iban: string; balance: number; history: number[] } {// toJSON bir beyaz liste: yalnızca döndürdüğü alanlar yazılır — pin de, '#balance' çöp alanı da girmez
  return {
    iban: this.iban,
    balance: this.#balance,
    history: [...this.#history], // Referans sızmasın diye kopya
  };
}
   get balance(): number {
         return this.#balance;
     }
       get history(): readonly number[] {
    return this.#history;
  }
 }
 const sec = new SecureAccount("TR03", 100, "1234");
 sec.deposit(50);
console.log(sec.balance)   //  → 150   (getter olduğu için parantez yok)
 
// @ts-expect-error : Property 'history' does not exist on type 'SecureAccount'.
sec.history.push(999);    
console.log("sec history:", sec.history) 
 // @ts-expect-error: Cannot assign to 'balance' because it is a read-only property.
 try { sec.balance = 1_000_000 }  // getter var ama setter yok, dışarıdan değiştirilemez. strict mode yüzünden çöker. 
  catch (err: unknown) {
   if (err instanceof Error) {
     console.log("Failed Try", err.message); 
   }else { throw err; }
 }
 // @ts-expect-error: Element implicitly has an 'any' type because expression of type '"#balance"' can't be used to index type 'SecureAccount'.
   //Property '#balance' does not exist on type 'SecureAccount'.
 try { console.log(sec["#balance"]);  } // etiket arar, bulammaz ve undefined döner.
  catch (err: unknown) {
   if (err instanceof Error) {
     console.log("Failed Try", err.message); 
   }else { throw err; }
}
 // @ts-expect-error: Property '#balance' does not exist on type 'SecureAccount'. Did you mean 'balance'?
sec["#balance"] = 5;
 console.log(sec.balance) // 150 döndürür.
 console.log("sec keys:", Object.keys(sec));   // gizli olanlar haricini basar. history ve iban // 6. B'nin kanıtından sonra tümünü döktü.
 console.log("sec json:", JSON.stringify(sec)); // # JSON'a sızmaz. hepsini basar.
 // ===== Bölüm 4 — karar: private mı # mı =====
 // Asıl soru: kimden koruyorum?
 // - Ekip arkadaşının hatasından, derleme anında → private/protected. Çalışma anında iz yok:
 //   alan keys/JSON'da görünür (Bölüm 2), acc["pin"]'e TS bile itiraz etmez (5) → testte içeri bakmak kolay.
 // - Aynı programdaki başka koddan, çalışma anında → #. Dışarıda kullanımı dilbilgisi hatası (01b), keys/JSON'da yok.
 //   Bedeli: alt sınıf dokunamaz (9), kısa yazımla kullanılamaz (11), JSON'a girmesi için toJSON gerekir.
 // - Tarayıcı kullanıcısından → hiçbiri. Sırlar istemci koduna konmaz.
 // readonly da silinir (iban: TR99). Çalışma anında değişmezlik: # alan + yalnızca getter (7).
 // protected alan alt sınıfa kuralı delme izni verir (savings history) → alan private, değişiklik protected metot.