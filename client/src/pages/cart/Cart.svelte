<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../../store/urlDomain.js";
    import CartItem from "./CartItem.svelte";
    import { checkAuthentication } from "../../auth/auth.js";
    import { cartCount } from "../../store/cartStore.js";
    import { isLoggedIn } from "../../store/accessToken.js";
    import { loadStripe } from "@stripe/stripe-js";

    let user;
    let cartItems = [];
    let totalPrice = 0;
    let stripe;

    onMount(async () => {
        stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
        try {
            user = await checkAuthentication();
            if (user) {
                const response = await fetch($BASE_URL + `/carts/${user._id}`, {
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    cartItems = data.items;
                    cartCount.set(cartItems.length);
                    calculateTotalPrice();

                } else {
                    console.error("Failed to fetch cart");
                }
            } else {
                console.error("User is not authenticated");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    });

    function calculateTotalPrice() {
        totalPrice = 0;
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            if (item.product && item.product.price) {
                totalPrice += item.product.price * item.quantity;
            }
        }
    }

    async function handleCheckout() {
        const response = await fetch($BASE_URL + "/create-checkout-session", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cartItems: cartItems.map(item => ({
                    product: { name: item.product.name, price: item.product.price },
                    quantity: item.quantity,
                })),
            }),
        });

        if (response.status === 200) {
            const { id: sessionId } = await response.json();
            await stripe.redirectToCheckout({ sessionId });
        }
    }

    async function deleteFromCart(productId) {
        const response = await fetch($BASE_URL + `/carts/${user._id}/${productId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.status === 200) {
            cartItems = cartItems.filter(cartItem => cartItem.product._id !== productId);
            calculateTotalPrice();
            cartCount.set(cartItems.length);
            console.log(cartItems);
        } else {
            console.error("Failed to remove item from cart");
        }
    }
</script>

{#if $isLoggedIn && user}
    <h1 class="text-2xl font-bold mb-4 md:mb-0 text-center">Your Cart</h1>
    <div class="cart flex flex-col md:flex-row md:justify-between bg-gray-200 p-4 rounded shadow">
        {#if cartItems.length === 0}
            <p>Your cart is empty.</p>
        {:else}
            <div class="cart-items w-full md:w-3/4">
                {#each cartItems as item (item._id)}
                    <CartItem {item} {deleteFromCart} totalPrice={totalPrice} key={item._id} />
                {/each}
            </div>

            <div class="justify-center w-54">
                <div class="total-price bg-white p-4 rounded shadow">
                    <p class="text-lg font-semibold">Total Price: {totalPrice}</p>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded md:self-start mt-4 md:mt-0" on:click={handleCheckout}>
                        Checkout
                    </button>
                </div>
            </div>
        {/if}
    </div>
{:else}
    <div class="flex flex-col items-center justify-center h-screen">
        <h2 class="text-5xl mb-4">Forbidden - either your token expired or you are not signed in - click here to sign in</h2>
        <a href="/client/public" class="text-3xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2">
            Login
        </a>
    </div>
{/if}
