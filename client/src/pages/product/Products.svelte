<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../../store/urlDomain.js";
    import Carousel from "svelte-carousel";
    import { checkAuthentication } from "../../auth/auth.js";
    import { cartCount } from "../../store/cartStore.js";
    import Swal from "sweetalert2";

    let products = [];
    let search = "";
    let sort = "sort";
    let username = "";
    let user;

    onMount(async () => {
        user = await checkAuthentication();
        try {
            const response = await fetch($BASE_URL + "/products");
            if (response.status === 200) {
                products = await response.json();
            }
        } catch (error) {
            console.error("Network Error:", error);
        }
    });

    $: filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
        .sort((product1, product2) => {
            switch (sort) {
                case "sort_by_price_low_to_high":
                    return product1.price - product2.price;
                case "sort_by_price_high_to_low":
                    return product2.price - product1.price;
                default:
                    return 0;
            }
        });

    async function addToCart(productId) {
        try {
            const response = await fetch($BASE_URL+ `/carts/${user._id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                }),
            });

            if (response.status === 200) {
                cartCount.update((count) => count + 1);
                await Swal.fire({
                    icon: "success",
                    title: "Added to your cart!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                    await Swal.fire({
                        icon: "error",
                        title: "That product is already in your cart!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
            }
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        }
    }
</script>

<div class="flex items-center justify-between mb-8">
    <h1 class="text-5xl">All products</h1>

    <div class="flex items-center gap-4">
        <input class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600" bind:value={search} placeholder="Search products..."/>
        <select class="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600" bind:value={sort}>
            <option value="sort_by_price_low_to_high">Lowest price first</option>
            <option value="sort_by_price_high_to_low">Highest price first</option>
        </select>
    </div>
</div>

<div class="grid grid-cols-3 gap-x-10 gap-y-10">
    {#each filteredProducts as product (product._id)}
        <div class="relative pt-6">
            <div class="flex justify-center">
                <Carousel>
                    {#each product.imageUrls as imageUrls}
                        <img class="w-full h-64 object-cover rounded shadow transform transition duration-500 hover:scale-105 hover:shadow-lg" src={imageUrls} alt={product.name}/>
                    {/each}
                </Carousel>
            </div>
            <div class="mt-2 ml-8">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold">{product.name}</h2>
                    <div class="flex-grow"></div>
                    <div class="mr-7">
                        <p class="text-xs text-gray-500 mt-[-5]">Posted by: {product.username}</p>
                    </div>
                </div>
                <p class="text-sm text-gray-600">{product.description}</p>
                <div class="flex items-center">
                    <p class="text-md font-semibold mb-3">Price: ${product.price}</p>
                </div>
                <button class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1 text-center" on:click={() => addToCart(product._id)}>
                    Add to cart
                </button>
            </div>
        </div>
    {/each}
</div>
