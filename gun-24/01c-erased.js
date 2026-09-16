class BankAccount {
  history = [];
  constructor(iban, balance, pin) {
   this.iban = iban;
   this.balance = balance;
   this.pin = pin;
    // burdaki thisleri kaldırırsak parametrelerle ne yapacağız? konsollar sırasıyla NaN , diğerini bilmiyorum. history ve balance çıktı. 
    this.history.push(this.balance);
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Invalid Amount");
    this.balance += amount;
    this.history.push(this.balance); // Bakiye değiştikçe logluyoruz
  }

  withdraw(amount, pin) {
    if (this.pin !== pin) {
      throw new Error("Wrong PIN");
    }
    if (amount > this.balance) {
      throw new Error("Insufficent Funds");
    }
    this.balance -= amount;
    this.history.push(this.balance);
  }

  getBalance() {
    return this.balance;
  }
}

   const acc = new BankAccount("TR01", 100, "1234");
   acc.deposit(50);
   console.log("erased balance:", acc.getBalance()); // 150  
console.log("erased keys:", Object.keys(acc)); // hepsini döker  
   
// TS dosyasında    npm run typecheck -- --erasableSyntaxOnly yazınca  This syntax is not allowed when 'erasableSyntaxOnly' is enabled hatasaı veriyor.