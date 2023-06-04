<script>
    import { accessToken, isLoggedIn } from "../../store/accessToken.js";
    import io from "socket.io-client";
    import { BASE_URL } from "../../store/urlDomain.js";
    import {checkAuthentication} from "../../auth/auth.js";
    import {getCookie} from "../../utils/cookieUtils.js";
    import {onMount} from "svelte";

    let messages = [];
    let newMessage = "";
    let username = "";
    let socket;
    let showChat = false;
    let user;






    onMount(async () => {
        user = await checkAuthentication();
        username = user.username

        socket = io($BASE_URL);

        socket.on("new-message", (data) => {
            if (data) {
                messages = [...messages, { username: data.username, message: data.message }];
            }
        });
    });


    function postMessage() {
        socket.emit("client-sends-a-message", { username: username, message: newMessage });
    }

    function toggleChat() {
        if (showChat) {
            showChat = false;
        } else {
            showChat = true;
        }
    }
</script>

<div class="fixed bottom-0 right-0 p-4 mb-10">
    {#if $isLoggedIn}
        <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out" on:click={toggleChat}>
            {#if showChat}
                Hide Chat
            {:else}
                Show Chat
            {/if}
        </button>
        {#if showChat}
            <div class="bg-white p-4 mt-4 rounded shadow-lg w-64">
                <form on:submit|preventDefault={postMessage}>
                    <input class="border p-2 rounded w-full" type="text" bind:value={newMessage} placeholder="Write your message here..." required>
                    <button class="bg-green-500 text-white px-4 py-2 mt-2 rounded" type="submit">Post Message</button>
                </form>
                <div>
                    {#each messages as message (message)}
                        <p><strong>{message.username}</strong>: {message.message}</p>
                    {/each}
                </div>
            </div>
        {/if}
    {/if}
</div>
