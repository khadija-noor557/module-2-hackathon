const supabaseUrl = "https://xmexfecjjalkhqtrlzzj.supabase.co";
const supabaseKey = "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";

const wrap = document.getElementById("detailsWrap");

// Turns a multi-line textarea value into <li> items
function toListItems(text) {
    if (!text) return [];
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

function renderRecipe(r) {
    const ingredients = toListItems(r.ingredients);
    const steps = toListItems(r.instructions);

    document.title = `${r.title || "Recipe"} | RecipeShare`;

    wrap.innerHTML = `
        <a href="all-recipes.html" class="back-link">← Back to All Recipes</a>

        <img class="hero-img" src="${r.image_url || FALLBACK_IMAGE}" alt="${r.title || "Recipe"}">

        <div class="d-flex gap-2 mt-3">
            <span class="category-badge">${r.category || "Recipe"}</span>
            ${r.difficulty ? `<span class="diff-badge">${r.difficulty}</span>` : ""}
        </div>

        <h1 class="recipe-title">${r.title || "Untitled Recipe"}</h1>
        <p class="recipe-desc">${r.description || ""}</p>

        <div class="meta-row">
            <div class="meta-item"><div class="num">${r.prep_time ? r.prep_time + " min" : "—"}</div><div class="lbl">PREP TIME</div></div>
            <div class="meta-item"><div class="num">${r.cook_time ? r.cook_time + " min" : "—"}</div><div class="lbl">COOK TIME</div></div>
            <div class="meta-item"><div class="num">${r.servings || "—"}</div><div class="lbl">SERVINGS</div></div>
            <div class="meta-item"><div class="num">${r.difficulty || "—"}</div><div class="lbl">DIFFICULTY</div></div>
        </div>

        <div class="row">
            <div class="col-md-5">
                <h2 class="section-title">Ingredients</h2>
                <ul class="ingredient-list">
                    ${ingredients.length ? ingredients.map(i => `<li>${i}</li>`).join("") : "<li>No ingredients listed.</li>"}
                </ul>
            </div>

            <div class="col-md-7">
                <h2 class="section-title">Instructions</h2>
                <ul class="step-list">
                    ${steps.length
                        ? steps.map((s, idx) => `<li><span class="step-num">${idx + 1}</span><span class="step-text">${s}</span></li>`).join("")
                        : "<li class='step-text'>No instructions listed.</li>"}
                </ul>
            </div>
        </div>

        ${r.notes ? `<div class="notes-box"><strong>Notes:</strong> ${r.notes}</div>` : ""}

        <div class="author-card">
            <div class="author-avatar">RC</div>
            <div>
                <div class="author-name">RecipeShare Cook</div>
                <div class="author-role">Shared this recipe</div>
            </div>
        </div>
    `;
}

async function loadRecipe() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        wrap.innerHTML = `<div class="details-error"><strong>No recipe selected.</strong><br>Go back to <a href="all-recipes.html">All Recipes</a> and pick one.</div>`;
        return;
    }

    const { data, error } = await client
        .from("recipe_data")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        console.error("Failed to load recipe:", error?.message);
        wrap.innerHTML = `<div class="details-error"><strong>Recipe not found.</strong><br>Go back to <a href="all-recipes.html">All Recipes</a>.</div>`;
        return;
    }

    renderRecipe(data);
}

loadRecipe();