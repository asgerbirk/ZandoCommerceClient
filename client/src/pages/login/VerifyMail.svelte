<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-navigator";
    import Swal from "sweetalert2";

    let token = "";

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get("token");
        if (token) {
            try {
                const response = await fetch(`http://localhost:8080/verify-email?token=${token}`)
                if (response.status === 200) {

                        Swal.fire({
                            icon: "success",
                            title: "Email verified successfully!",
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            navigate("/");
                        });

                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Verification failed. Invalid or expired token.",
                        showConfirmButton: true,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
</script>

<div class="flex justify-center items-center h-screen">
    <div>Verifying email...</div>
</div>
