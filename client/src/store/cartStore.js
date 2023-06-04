import { writable } from "svelte/store";


let initialCartCount = 0;

export const cartCount = writable(initialCartCount);

cartCount.subscribe(value => {
    localStorage.setItem("cartCount", JSON.stringify(value));
});