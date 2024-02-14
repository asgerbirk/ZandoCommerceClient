import { writable } from "svelte/store";
import { getCookie, removeCookie, setCookie } from "../utils/cookieUtils";
import {cartCount} from "./cartStore.js";

export const accessToken = writable(getCookie("jwt"));

let loggedIn
if (getCookie("jwt")){
    loggedIn = true;
}else {
    loggedIn = false
}

export const isLoggedIn = writable(loggedIn)

accessToken.subscribe(value => {
    if (value) {
        setCookie("jwt", value, { expires: 1 });
        isLoggedIn.set(true);
    } else {
        isLoggedIn.set(false);
    }
});



export function removeAccessToken() {
    accessToken.set(null);
    removeCookie("jwt");
    cartCount.set(0);
    localStorage.removeItem("cartCount");
}