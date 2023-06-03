<script>
    import ChatBot from "../../components/chatbot/ChatBot.svelte";
    import { onMount } from "svelte";
    import { checkAuthentication } from "../../auth/auth.js";
    import { BASE_URL } from "../../store/urlDomain.js";
    import { cartCount } from "../../store/cartStore.js";
    import {Link} from "svelte-navigator";

    let user;

    onMount(async () => {
        try {
            user = await checkAuthentication();
            if (user) {
                const response = await fetch($BASE_URL + `/carts/${user._id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    cartCount.set(data.items.length);
                }
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    });
</script>

<div class="h-screen bg-cover flex items-center justify-center" style="background-image: url('/zandoCommercee.webp'); width: 100vw; position: absolute; left: 0; right: 0;">
    <div class="flex flex-col items-center space-y-4 ml-auto mr-20">
        <Link to="/products" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded md:self-start mt-4 md:mt-0 flex">
            All products
        </Link>
        <Link to="/createProduct" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded md:self-start mt-4 md:mt-0">
            Create a product for sale
        </Link>
    </div>
</div>

<ChatBot />

