const recipeModalUrl =
    "https://xmexfecjjalkhqtrlzzj.supabase.co";


const recipeModalKey =
    "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";


const recipeModalClient =
    supabase.createClient(
        recipeModalUrl,
        recipeModalKey
    );


const recipeModalFallback =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85";


/* =========================
   CREATE MODAL
========================= */

function createRecipeModal() {

    if (
        document.getElementById(
            "recipeModalOverlay"
        )
    ) {
        return;
    }


    const modal =
        document.createElement("div");


    modal.innerHTML = `

        <div
            class="recipe-modal-overlay"
            id="recipeModalOverlay"
        >

            <div
                class="recipe-modal"
                role="dialog"
                aria-modal="true"
            >

                <button
                    class="recipe-modal-close"
                    id="recipeModalClose"
                    type="button"
                >
                    ×
                </button>


                <div id="recipeModalBody">

                    <div class="recipe-modal-loading">
                        Loading recipe...
                    </div>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal.firstElementChild
    );


    document
        .getElementById("recipeModalClose")
        .addEventListener(
            "click",
            closeRecipeModal
        );


    document
        .getElementById("recipeModalOverlay")
        .addEventListener(
            "click",
            function (e) {

                if (
                    e.target.id ===
                    "recipeModalOverlay"
                ) {

                    closeRecipeModal();

                }

            }
        );
}


/* =========================
   ESCAPE HTML
========================= */

function escapeRecipeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   CONVERT RECIPE LIST
========================= */

function convertRecipeList(value) {

    if (!value) {
        return [];
    }


    if (Array.isArray(value)) {
        return value;
    }


    if (typeof value === "string") {

        try {

            const parsed =
                JSON.parse(value);


            if (Array.isArray(parsed)) {
                return parsed;
            }

        } catch (error) {

            // normal text

        }


        return value
            .split(/\r?\n/)
            .map(item => item.trim())
            .filter(item => item !== "");
    }


    return [];
}


/* =========================
   OPEN MODAL
========================= */

async function openRecipeModal(recipeId) {

    createRecipeModal();


    const overlay =
        document.getElementById(
            "recipeModalOverlay"
        );


    const body =
        document.getElementById(
            "recipeModalBody"
        );


    overlay.classList.add("show");


    document.body.style.overflow =
        "hidden";


    body.innerHTML = `

        <div class="recipe-modal-loading">

            <strong>
                Loading recipe...
            </strong>

        </div>

    `;


    const { data, error } =
        await recipeModalClient
            .from("recipe_data")
            .select("*")
            .eq("id", recipeId)
            .single();


    if (error) {

        console.error(error);


        body.innerHTML = `

            <div class="recipe-modal-loading">

                <strong>
                    Couldn't load recipe.
                </strong>

                <p>
                    ${escapeRecipeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

        return;
    }


    renderRecipeModal(data);
}


/* =========================
   MAKE FUNCTION GLOBAL
========================= */

window.openRecipeModal =
    openRecipeModal;


/* =========================
   RENDER RECIPE
========================= */

function renderRecipeModal(recipe) {

    const body =
        document.getElementById(
            "recipeModalBody"
        );


    const ingredients =
        convertRecipeList(
            recipe.ingredients
        );


    const instructions =
        convertRecipeList(
            recipe.instructions
        );


    const prepTime =
        recipe.prep_time || "—";


    const cookTime =
        recipe.cook_time || "—";


    const servings =
        recipe.servings || "—";


    const difficulty =
        recipe.difficulty || "Easy";


    const category =
        recipe.category || "Recipe";


    const image =
        recipe.image_url ||
        recipeModalFallback;


    const prepNumber =
        Number(recipe.prep_time) || 0;


    const cookNumber =
        Number(recipe.cook_time) || 0;


    const total =
        prepNumber + cookNumber;


    body.innerHTML = `

        <div class="recipe-modal-image-wrap">

            <img
                src="${escapeRecipeHTML(image)}"
                alt="${escapeRecipeHTML(
                    recipe.title || "Recipe"
                )}"
                class="recipe-modal-image"
            >


            <div class="recipe-modal-badges">

                <span
                    class="recipe-modal-badge category"
                >
                    ${escapeRecipeHTML(category)}
                </span>


                <span
                    class="recipe-modal-badge"
                >
                    ⏱ ${
                        total > 0
                            ? total
                            : escapeRecipeHTML(
                                prepTime
                            )
                    } min
                </span>

            </div>

        </div>


        <div class="recipe-modal-content">

            <h2 class="recipe-modal-title">

                ${escapeRecipeHTML(
                    recipe.title ||
                    "Untitled Recipe"
                )}

            </h2>


            <p
                class="recipe-modal-description"
            >

                ${escapeRecipeHTML(
                    recipe.description ||
                    "A delicious recipe from RecipeShare."
                )}

            </p>


            <div class="recipe-modal-meta">


                <div class="recipe-meta-item">

                    <div class="recipe-meta-icon">
                        🍴
                    </div>

                    <span class="recipe-meta-label">
                        Prep Time
                    </span>

                    <span class="recipe-meta-value">
                        ${escapeRecipeHTML(
                            prepTime
                        )} min
                    </span>

                </div>


                <div class="recipe-meta-item">

                    <div class="recipe-meta-icon">
                        🍲
                    </div>

                    <span class="recipe-meta-label">
                        Cook Time
                    </span>

                    <span class="recipe-meta-value">
                        ${escapeRecipeHTML(
                            cookTime
                        )} min
                    </span>

                </div>


                <div class="recipe-meta-item">

                    <div class="recipe-meta-icon">
                        👥
                    </div>

                    <span class="recipe-meta-label">
                        Servings
                    </span>

                    <span class="recipe-meta-value">
                        ${escapeRecipeHTML(
                            servings
                        )}
                    </span>

                </div>


                <div class="recipe-meta-item">

                    <div class="recipe-meta-icon">
                        👨‍🍳
                    </div>

                    <span class="recipe-meta-label">
                        Difficulty
                    </span>

                    <span class="recipe-meta-value">
                        ${escapeRecipeHTML(
                            difficulty
                        )}
                    </span>

                </div>


            </div>


            <div class="recipe-modal-sections">


                <div class="recipe-modal-section">

                    <h3
                        class="recipe-modal-section-title"
                    >

                        <span class="section-icon">
                            🥗
                        </span>

                        Ingredients

                    </h3>


                    <ul
                        class="recipe-ingredients"
                    >

                        ${
                            ingredients.length

                                ? ingredients
                                    .map(item => `

                                        <li>
                                            ${escapeRecipeHTML(
                                                item
                                            )}
                                        </li>

                                    `)
                                    .join("")

                                : `

                                    <li>
                                        Ingredients not available.
                                    </li>

                                `
                        }

                    </ul>

                </div>


                <div class="recipe-modal-section">

                    <h3
                        class="recipe-modal-section-title"
                    >

                        <span class="section-icon">
                            ☷
                        </span>

                        Instructions

                    </h3>


                    <ol
                        class="recipe-instructions"
                    >

                        ${
                            instructions.length

                                ? instructions
                                    .map(item => `

                                        <li>
                                            ${escapeRecipeHTML(
                                                item
                                            )}
                                        </li>

                                    `)
                                    .join("")

                                : `

                                    <li>
                                        Instructions not available.
                                    </li>

                                `
                        }

                    </ol>

                </div>


            </div>


            ${
                recipe.notes

                    ? `

                        <div class="recipe-notes">

                            <div
                                class="recipe-notes-title"
                            >
                                📝 Notes
                            </div>


                            <p>
                                ${escapeRecipeHTML(
                                    recipe.notes
                                )}
                            </p>

                        </div>

                    `

                    : ""
            }


            <div class="recipe-modal-footer">


                <div class="recipe-author">

                    <div
                        class="recipe-author-avatar"
                    >
                        RC
                    </div>


                    <div>

                        <strong>
                            RecipeShare Cook
                        </strong>

                        <span>
                            Shared this recipe
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    class="recipe-save-btn"
                >
                    ♡ Save
                </button>


            </div>


        </div>

    `;
}


/* =========================
   CLOSE MODAL
========================= */

function closeRecipeModal() {

    const overlay =
        document.getElementById(
            "recipeModalOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove("show");


    document.body.style.overflow = "";
}


window.closeRecipeModal =
    closeRecipeModal;


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    function (e) {

        if (e.key === "Escape") {

            closeRecipeModal();

        }

    }
);