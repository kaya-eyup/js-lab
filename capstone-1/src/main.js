import "./style.css";
// import { matchRoute } from "./router.js";
import { parseQuery } from "./router.js";

//  console.log(matchRoute("/"))
//  console.log(matchRoute("/product/121"))
//  console.log(matchRoute("/product/"))
//  console.log(matchRoute("/product/121/reviews"))
//  console.log(matchRoute("/urunler"))
// console.log(matchRoute(""));

console.log(parseQuery("")); // { q: "", page: 1 }
console.log(parseQuery("?q=phone")); // { q: "phone", page: 1 }
console.log(parseQuery("?q=phone&page=3")); // { q: "phone", page: 3 }
console.log(parseQuery("?page=abc")); // { q: "", page: 1 }
console.log(parseQuery("?page=-5")); // { q: "", page: 1 }
console.log(parseQuery("?page=2.7")); // { q: "", page: 1 }
console.log(parseQuery("?q=t%C3%BCrk")); // { q: "türk", page: 1 }
