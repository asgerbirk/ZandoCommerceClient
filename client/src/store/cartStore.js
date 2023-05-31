import { writable } from "svelte/store";


const initialCartCount = localStorage.getItem('cartCount')
    ? JSON.parse(localStorage.getItem('cartCount'))
    : 0;

export const cartCount = writable(initialCartCount);

cartCount.subscribe(value => {
    localStorage.setItem('cartCount', JSON.stringify(value));
});