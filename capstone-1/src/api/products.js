import { http } from "./lib/http.js";


export async function getProducts() {
    
    return http(`https://dummyjson.com`);
    
    
}


