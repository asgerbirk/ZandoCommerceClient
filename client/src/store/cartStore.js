import { writable } from "svelte/store";


let initialCartCount = 0;


    const storedValueInStorage = localStorage.getItem("cartCount");
    if (storedValueInStorage !== null){
        initialCartCount = JSON.parse(storedValueInStorage)
    }

export const cartCount = writable(initialCartCount);

cartCount.subscribe(value => {
    localStorage.setItem('cartCount', JSON.stringify(value));
});




