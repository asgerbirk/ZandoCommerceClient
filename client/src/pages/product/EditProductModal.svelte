<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Carousel from "svelte-carousel";
    import {BASE_URL} from "../../store/urlDomain.js";

    export let showModal = false;
    export let productToEdit;
    export let updateProduct;

    let image = "";
    let name = "";
    let description = "";
    let price = "";

    async function handleUpdate() {
        try {
            productToEdit.name = name;
            productToEdit.description = description;
            productToEdit.price = price;

            const response = await fetch($BASE_URL + `/products/${productToEdit._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productToEdit)
            });

            if (response.status === 200) {
                const data = await response.json();
                updateProduct(data);


            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    function handleSubmit() {
        handleUpdate();
        showModal = false;
    }


    onMount(() => {
        image = productToEdit.imageUrls || "";
        name = productToEdit.name || "";
        description = productToEdit.description || "";
        price = productToEdit.price || "";
    });
</script>


{#if showModal}
    <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-overlay bg-black opacity-50"></div>
        <div class="modal-container bg-white rounded-lg shadow-lg max-w-xl">
            <form on:submit={handleSubmit} class="modal-content p-8">
                <div class="flex justify-center">
                    <Carousel>
                        {#each productToEdit.imageUrls as imageUrls}
                            <img class="w-full h-64 object-cover rounded shadow transform transition duration-500 hover:scale-105 hover:shadow-lg" src={imageUrls} alt={productToEdit.name}/>
                        {/each}
                    </Carousel>
                </div>
                <label for="name" class="block text-gray-700 text-xl font-bold mb-2 text-center">It is not possible to update the pictures!</label>

                <div class="mb-4">
                    <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input type="text"
                           id="name"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           bind:value={name} />
                </div>

                <div class="mb-4">
                    <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                    <textarea id="description"
                              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              bind:value={description}></textarea>
                </div>

                <div class="mb-4">
                    <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                    <input type="number"
                           id="price"
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           bind:value={price} />
                </div>

                <div class="flex items-center justify-between">
                    <button type="button" on:click={() => showModal = false} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                        Cancel
                    </button>
                    <button type="submit" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

