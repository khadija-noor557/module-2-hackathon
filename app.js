const supabaseUrl = "https://xmexfecjjalkhqtrlzzj.supabase.co";
const supabaseKey = "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey)

console.log(client);



const signUpForm = document.querySelector("#signupForm");

if (signUpForm) {
    signUpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const name = document.querySelector("#name").value;
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;
            const repeatpassword = document.querySelector("#confirmPassword").value;

            let emptyField = false;
            const inputs = document.querySelectorAll("input");
            inputs.forEach((input) => {
                if (input.value === "") {
                    input.style.border = "2px solid red";
                    emptyField = true;
                }
            });

            if (emptyField) return;

            if (password !== repeatpassword) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Password do not match!"
                });
                return;
            }

            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: { data: { name } }
            });

            if (error) {
                Swal.fire({ icon: "error", title: "Signup failed", text: error.message });
                return;
            }

            console.log("USER:", data.user);
            console.log("SESSION:", data.session);

            if (data.session) {
                
                await Swal.fire({
                    title: "Registration successful!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
                window.location.href = "dashboard.html";
            } else {
                
                await Swal.fire({
                    icon: "info",
                    title: "Check your email",
                    text: "Confirm your email, then login."
                });
                window.location.href = "login.html";
            }

        } catch (error) {
            console.log(error);
                Swal.fire({ icon: "error", title: "Something went wrong", text: error.message });

        }
    });
}


const inputs = document.querySelectorAll("input")
inputs.forEach((input) => {
    input.addEventListener("input", () => {
        if (input.value !== "") {
            input.style.border = ""

        }
    })

})