<script>
    import { Link, navigate } from 'svelte-navigator';
    import { isLoggedIn, removeAccessToken } from "../../store/accessToken.js";
    import { BASE_URL } from "../../store/urlDomain.js";
    import { cartCount } from "../../store/cartStore.js";

    async function handleLogout() {
        try {
            const response = await fetch($BASE_URL + "/logout", {
                method: 'POST',
                credentials: 'include', // Include credentials for sending cookies
            });

            if (response.status === 200) {
                removeAccessToken();
                navigate("/");
            }
        } catch (error) {

        }
    }
</script>

<nav class="bg-gray-800 py-2 sticky top-0 z-10">
    <div class="container mx-auto px-4">
        <div class="flex flex-col items-start justify-between gap-2">
            <div class="flex justify-between w-full px-4">
                <Link to="/home" class="text-white font-bold text-xl hover:text-gray-400">
                    Zando Commerce
                </Link>
                <div class="flex items-center space-x-4">
                    <Link to="/account" class="text-white hover:text-gray-400">
                        <i class="fas fa-user-circle fa-lg"></i>
                    </Link>
                    <Link to="/cart" class="text-white hover:text-gray-400">
                        <i class="fas fa-shopping-cart fa-lg"></i>
                        {#if $cartCount > 0}
                            <span class="text-white">{$cartCount}</span>
                        {/if}
                    </Link>
                </div>
            </div>
            <div class="flex items-center space-x-4 w-full justify-end pr-4">
                <Link to="/products" class="text-white text-sm hover:text-gray-400">
                    Products
                </Link>
                <Link to="/createProduct" class="text-white text-sm hover:text-gray-400">
                    Create product
                </Link>
                {#if $isLoggedIn}
                    <Link to="/" on:click={handleLogout} class="text-white hover:text-gray-400 text-sm">
                        Logout
                    </Link>
                {:else}
                    <Link to="/" class="text-white hover:text-gray-400 text-sm">
                        Login
                    </Link>
                {/if}
            </div>
        </div>
    </div>
</nav>

