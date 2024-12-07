const searchForm = document.querySelector("form");
const searchInput = document.querySelector("#search");
const cuisineSelect = document.querySelector("#cuisine-select");
const resultsList = document.querySelector("#results");
const FavouriteRecipesList = document.querySelector("#FavouriteRecipesList");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchRecipes();
});

async function searchRecipes() {
  const searchValue = searchInput.value.trim();
  const cuisineValue = cuisineSelect.value;

  if (!searchValue) {
    alert("Please enter a search term.");
    return;
  }

  let url = `https://api.edamam.com/search?q=${searchValue}&app_id=e4d0c601&app_key=8dc696d2f9cb439e3da20a4541a61704&from=0&to=12`;

  if (cuisineValue) {
    url += `&cuisineType=${cuisineValue}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch recipes. Please try again.");
    }
    const data = await response.json();
    console.log(data);
    if (!data.hits || data.hits.length === 0) {
      resultsList.innerHTML = "<p>No recipes found. Try another item!</p>";
      return;
    }
    displayRecipes(data.hits);
    console.log(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    resultsList.innerHTML =
      "<p>An error occurred while fetching recipes. Please try again later.</p>";
  }
}

function displayRecipes(recipes) {
  let html = "";
  recipes.forEach((recipe, index) => {
    html += `
      <div>
        <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
        <h3>${recipe.recipe.label}</h3>
        <ul>
          ${recipe.recipe.ingredientLines
            .map((ingredient) => `<li>${ingredient}</li>`)
            .join("")}
        </ul>
        <a href="${
          recipe.recipe.url
        }" target="_blank" class="result-a">View Recipe</a>
        <button class="SaveFavouriteButton" data-index="${index}">Save as Favourite</button>
      </div>
    `;
  });
  resultsList.innerHTML = html;

  const favouriteButtons = document.querySelectorAll(".SaveFavouriteButton");
  favouriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const recipeIndex = e.target.dataset.index;
      saveFavouriteRecipe(recipes[recipeIndex].recipe);
    });
  });
}

function saveFavouriteRecipe(recipe) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  if (!favourites.find((fav) => fav.label === recipe.label)) {
    favourites.push(recipe);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    loadFavouriteRecipes();
    alert(`${recipe.label} is added to favourites!`);
  } else {
    alert(`${recipe.label} is already in favourites.`);
  }
}

function loadFavouriteRecipes() {
  FavouriteRecipesList.innerHTML = "";
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  favourites.forEach((recipe) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item";

    listItem.style.display = "flex";
    listItem.style.justifyContent = "center";
    listItem.style.alignItems = "center";
    listItem.style.height = "50px";

    const recipeLink = document.createElement("a");
    recipeLink.textContent = recipe.label;
    recipeLink.href = recipe.url;
    recipeLink.target = "_blank";
    recipeLink.style.textDecoration = "none";
    recipeLink.style.color = "white";
    recipeLink.style.fontSize = "20px";

    listItem.appendChild(recipeLink);

    FavouriteRecipesList.appendChild(listItem);
  });
}

window.addEventListener("load", loadFavouriteRecipes);
