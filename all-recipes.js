const supabaseUrl = "https://xmexfecjjalkhqtrlzzj.supabase.co";
const supabaseKey = "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";

let allRecipes = [];
let activeCat = "All";

const grid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");

// ---- Fetch recipes from Supabase ----
async function loadRecipes() {

    grid.innerHTML = `<div class="col-12 no-results"><strong>Loading recipes...</strong></div>`;

    const { data, error } = await client
        .from("recipe_data")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load recipes:", error.message);
        grid.innerHTML = `<div class="col-12 no-results"><strong>Couldn't load recipes</strong>${error.message}</div>`;
        return;
    }

    allRecipes = data || [];
    render();
}

function totalTime(r) {
    const prep = Number(r.prep_time) || 0;
    const cook = Number(r.cook_time) || 0;
    const total = prep + cook;
    return total > 0 ? `${total} min` : (r.prep_time || r.cook_time || "—");
}

// ---- Filter + render ----
function render() {
    const q = searchInput.value.trim().toLowerCase();

    const filtered = allRecipes.filter(r =>
        (activeCat === "All" || r.category === activeCat) &&
        (r.title || "").toLowerCase().includes(q)
    );

    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-12 no-results"><strong>No recipes found</strong>Try a different search or category.</div>`;
        return;
    }

    filtered.forEach(r => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="recipe-card">
                <img src="${r.image_url || FALLBACK_IMAGE}" alt="${r.title || "Recipe"}">
                <div class="recipe-content">
                    <div class="d-flex justify-content-between mb-3">
                        <span class="category-badge">${r.category || "Recipe"}</span>
                        <span class="recipe-time">⏱ ${totalTime(r)}</span>
                    </div>
                    <h3>${r.title || "Untitled Recipe"}</h3>
                    <p>${r.description || ""}</p>
                    <div class="recipe-footer">
                        <span>By RecipeShare Cook</span>
                        <span>♡ Save</span>
                    </div>
                </div>
            </div>`;
        grid.appendChild(col);
    });
}

document.getElementById("filterRow").addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-chip")) {
        document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        activeCat = e.target.dataset.cat;
        render();
    }
});

searchInput.addEventListener("input", render);

loadRecipes();