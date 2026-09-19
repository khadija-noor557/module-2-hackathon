const supabaseUrl = "https://xmexfecjjalkhqtrlzzj.supabase.co";
const supabaseKey = "sb_publishable_MscDQGxX8gej_btcdCaQjA_6qODt-W8";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey)

console.log(client);


// logout btn
const logOutBtn = document.querySelector("#logoutBtn")
logOutBtn.addEventListener("click", async () => {
  const { error } = await client.auth.signOut()

  if (error) {
    console.log(error.message);
    return;
  }

  localStorage.clear()
  sessionStorage.clear();

  window.location.href = "index.html"
})


// get user name on main section
const userDashboard = document.querySelector("#userDashboard");

async function getUserData() {

  const { data: { user }, error } = await client.auth.getUser();

  if (error) {
    console.log(error.message);
    return;
  }

  if (user) {
    document.querySelector("#userName").textContent = user.user_metadata.name;;
  }
}

getUserData();



// get all data/card
if (window.location.pathname.endsWith("/dashboard.html")) {

  const getAllData = async () => {
    try {
      const { data, error } = await client
        .from('recipe_data')
        .select();

      let recipeData = document.getElementById("recipePost");

      if (error) {
        console.log(error);
        return;
      }
      if (!data) return;

      // Purana dynamic content clear 
      recipeData.querySelectorAll('.dashboard-recipe-cardc').forEach(card => card.remove());

      data.forEach((recipePost) => {

        const card = document.createElement("article");
        card.className = "dashboard-recipe-card ";

        card.innerHTML = `
    <div class="dashboard-recipe-image">
        <img src="${recipePost.image_url || 'https://placehold.co/400x220/EEE/999?text=No+Image'}"
             alt="${recipePost.title || ''}"
             onerror="this.src='https://placehold.co/400x220/EEE/999?text=No+Image'">

        <span class="recipe-status">
            ${recipePost.status || 'Published'}
        </span>
    </div>

    <div class="dashboard-recipe-content">

        <span class="category-badge">
            ${recipePost.category || 'Uncategorized'}
        </span>

        <h3>${recipePost.title || 'Untitled'}</h3>

        <p>${recipePost.description || ''}</p>

        <div class="dashboard-recipe-meta">
            <span>⏱ ${recipePost.prep_time || 0} min prep</span>
            <span>🍳 ${recipePost.cook_time || 0} min cook</span>
        </div>

        <div class="dashboard-card-actions">

            <a href="index.html#recipes" class="btn btn-outline-success">
                View Recipe
            </a>

            <button class="edit-action" onclick="update('${recipePost.id}')">
                Edit
            </button>

            <button onclick="removePost('${recipePost.id}')">
                Delete
            </button>

        </div>
    </div>
`;

        recipeData.appendChild(card);

      });


      // ---- EDIT ----
      // EDIT RECIPE
      window.update = async (id) => {

        const { data, error } = await client
          .from("recipe_data")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          console.log(error.message);
          return;
        }

        const { title, category, instructions } = data;

        const { value: formValues } = await Swal.fire({
          title: "Edit Recipe",

          html: `
            <input id="title" class="swal2-input" value="${title || ''}" placeholder="Title">

            <input id="category" class="swal2-input" value="${category || ''}" placeholder="Category">

            <textarea id="instructions" class="swal2-textarea" placeholder="Instructions">${instructions || ''}</textarea>
        `,

          showCancelButton: true,

          preConfirm: () => {
            return {
              title: document.getElementById("title").value,
              category: document.getElementById("category").value,
              instructions: document.getElementById("instructions").value
            };
          }
        });

        if (!formValues) return;

        const { error: updateError } = await client
          .from("recipe_data")
          .update(formValues)
          .eq("id", id);

        if (updateError) {
          console.log(updateError.message);
          return;
        }

        Swal.fire("Updated!", "Recipe updated successfully.", "success")
          .then(() => location.reload());
      };

      // ---- DELETE ----

      window.removePost = async (id) => {

        const result = await Swal.fire({
          title: "Delete Recipe?",
          text: "This can't be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it"
        });

        if (!result.isConfirmed) return;

        const { error } = await client
          .from("recipe_data")
          .delete()
          .eq("id", id);

        if (error) {
          console.log(error.message);
          return;
        }

        Swal.fire("Deleted!", "Recipe deleted successfully.", "success")
          .then(() => location.reload());
      };
    }
    catch (error) {
      console.log(error);
    }
  };

  getAllData();
}