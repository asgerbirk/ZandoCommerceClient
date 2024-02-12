import { isLoggedIn } from "../store/accessToken.js";
import {onMount} from "svelte";
import { BASE_URL } from "../store/urlDomain.js";


export async function checkAuthentication() {
    let user;

    try {
        const response = await fetch("https://zandocommerceapi.onrender.com/login", {
            credentials: "include" // Include credentials for sending cookies
        });

        if (response.status === 200) {
            const data = await response.json();
            user = data.user;
            isLoggedIn.set(true);
        } else {
            isLoggedIn.set(false);
        }
    } catch (error) {
        console.error(error);
        isLoggedIn.set(false);
    }
    return user;
}