const supabaseUrl = "https://xmexfecjjalkhqtrlzzj.supabase.co";
const supabaseKey = "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

//  Image ko Supabase Storage pe upload karne wala function 
async function uploadRecipeImage(file) {

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `recipes/${Date.now()}-${safeName}`;

    const { error: uploadError } = await client
        .storage
        .from("images")
        .upload(path, file);

    if (uploadError) {
        console.error("Image upload failed:", uploadError.message);
        throw uploadError;
    }

    const { data } = client
        .storage
        .from("images")
        .getPublicUrl(path);

    return data.publicUrl;
}


// ---- Post save karne wala main function ----
async function saveRecipe(status) {
    console.log(status)

    try {

        // Get logged-in user, if available
        const { data: { user }, error: userError } =
            await client.auth.getUser();

        if (userError) {
            console.warn("Could not get user:", userError.message);
        }

        // Get selected image
        const imageInput = document.getElementById("recipeImage");
        const file = imageInput.files[0];

        let image_url = null;

        // Upload image if selected
        if (file) {
            image_url = await uploadRecipeImage(file);
        }

        // Prepare recipe data
        const recipe = {
            title: document.getElementById("recipeTitle").value.trim(),
            description: document.getElementById("recipeDescription").value.trim(),
            category: document.getElementById("recipeCategory").value,
            difficulty: document.getElementById("difficulty").value,
            ingredients: document.getElementById("ingredients").value.trim(),
            instructions: document.getElementById("instructions").value.trim(),
            prep_time: document.getElementById("prepTime").value.trim(),
            cook_time: document.getElementById("cookTime").value.trim(),
            servings: document.getElementById("servings").value
                ? Number(document.getElementById("servings").value)
                : null,
            notes: document.getElementById("recipeNotes").value.trim(),
            image_url: image_url
        };

        // Add user_id only when a user is logged in
        if (user) {
            recipe.user_id = user.id;
        }

        // Insert recipe into Supabase
        const { error } = await client
            .from("recipe_data")
            .insert([recipe]);

        if (error) {
            console.error("Recipe insert failed:", error.message);

            Swal.fire({
                icon: "error",
                title: "Recipe Not Saved",
                text: error.message
            });

            return;
        }

        await Swal.fire({
            icon: "success",
            title: "Recipe Published!",
            text: "Your recipe has been saved successfully."
        });

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Something Went Wrong",
            text: error.message || "Please try again."
        });
    }
}


// ---- Publish button ----
const recipeForm = document.getElementById("recipeForm");


recipeForm.addEventListener("submit", function (e) {

    e.preventDefault();
    saveRecipe();

});

/// Image preview

const recipeImage = document.getElementById("recipeImage");
const recipePreview = document.getElementById("recipePreview");
const previewPlaceholder = document.getElementById("previewPlaceholder");

if (recipeImage && recipePreview) {
    recipeImage.addEventListener("change", () => {
        const file = recipeImage.files[0];

        if (file) {
            recipePreview.src = URL.createObjectURL(file);
            recipePreview.style.display = "block";

            if (previewPlaceholder) {
                previewPlaceholder.style.display = "none";
            }
        }
    });
}