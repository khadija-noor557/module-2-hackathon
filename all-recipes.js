const supabaseUrl = "https://xmexfecjjalkhqtrlzzj.supabase.co";
const supabaseKey = "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";

let allRecipes = [];
let activeCat = "All";

const grid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");


async function loadRecipes() {

    grid.innerHTML = `
        <div class="col-12 no-results">
            <strong>Loading recipes...</strong>
        </div>
    `;

    const { data, error } = await client
        .from("recipe_data")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error("Failed to load recipes:", error.message);

        grid.innerHTML = `
            <div class="col-12 no-results">
                <strong>Couldn't load recipes</strong>
                <br>
                ${error.message}
            </div>
        `;

        return;
    }

    allRecipes = data || [];

    render();
}


function totalTime(recipe) {

    const prep = Number(recipe.prep_time) || 0;
    const cook = Number(recipe.cook_time) || 0;

    const total = prep + cook;

    if (total > 0) {
        return `${total} min`;
    }

    return recipe.prep_time || recipe.cook_time || "—";
}


function render() {

    const q = searchInput.value.trim().toLowerCase();

    const filtered = allRecipes.filter(recipe => {

        const categoryMatch =
            activeCat === "All" ||
            recipe.category === activeCat;

        const searchMatch =
            (recipe.title || "").toLowerCase().includes(q);

        return categoryMatch && searchMatch;
    });


    grid.innerHTML = "";


    if (filtered.length === 0) {

        grid.innerHTML = `
            <div class="col-12 no-results">
                <strong>No recipes found</strong>
                <br>
                Try a different search or category.
            </div>
        `;

        return;
    }


    filtered.forEach(recipe => {

        const col = document.createElement("div");

        col.className = "col-md-6 col-lg-4";


        col.innerHTML = `
            <div class="recipe-card">

                <img
                    src="${recipe.image_url || FALLBACK_IMAGE}"
                    alt="${recipe.title || "Recipe"}"
                >

                <div class="recipe-content">

                    <div class="d-flex justify-content-between mb-3">

                        <span class="category-badge">
                            ${recipe.category || "Recipe"}
                        </span>

                        <span class="recipe-time">
                            ⏱ ${totalTime(recipe)}
                        </span>

                    </div>


                    <h3>
                        ${recipe.title || "Untitled Recipe"}
                    </h3>


                    <p>
                        ${recipe.description || ""}
                    </p>


                    <div class="recipe-footer">

                        <span>
                            By RecipeShare Cook
                        </span>

                        <span>
                            ♡ Save
                        </span>

                    </div>


                    <button
                        type="button"
                        class="view-recipe-btn view-recipe"
                        data-id="${recipe.id}"
                    >
                        View Recipe →
                    </button>

                </div>

            </div>
        `;


        grid.appendChild(col);

    });

}


/* CATEGORY FILTER */

document
    .getElementById("filterRow")
    .addEventListener("click", function (e) {

        const button = e.target.closest(".filter-chip");

        if (!button) return;


        document
            .querySelectorAll(".filter-chip")
            .forEach(chip => {
                chip.classList.remove("active");
            });


        button.classList.add("active");


        activeCat = button.dataset.cat;

        render();

    });


/* SEARCH */

searchInput.addEventListener("input", render);


/* VIEW RECIPE BUTTON */

grid.addEventListener("click", function (e) {

    const button = e.target.closest(".view-recipe");

    if (!button) return;


    const recipeId = button.dataset.id;

    const recipe = allRecipes.find(
        item => String(item.id) === String(recipeId)
    );


    if (!recipe) {
        console.error("Recipe not found:", recipeId);
        return;
    }


    openRecipeModal(recipe.id);

});


loadRecipes();