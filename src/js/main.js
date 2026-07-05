/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

// function showPage(pageId) {
//     // 1. Hide/show your sections
//     document.querySelectorAll('.content-page').forEach(div => div.style.display = 'none');
//     document.getElementById(pageId + '-section').style.display = 'block';

//     // 2. Change the URL smoothly
//     // Arguments: (state data, title, new url path)
//     history.pushState({page: pageId}, "", "/" + pageId);
// }
import {
  getAreas,
  getMealTypes,
  getRandomMeals,
  getByArea,
  getByType,
  getByName,
  getById,
  getNutrition,
  getByProductCategory,
  getByProductName,
  getProductByCode,
  getProductsCategories
} from "./retrieve.js";
import {
  showSpinner,
  showSpinnerBefore,
  displayNotFound,
  changeActive,
  disableNutritionFacts,
  enableNutritionFacts,
  removeSpinnerBefore,
  displayNotFoundBefore,
  removeNotFoundBefore,
  disableSectionsExcept,
  enableHomeSection,
  changeActiveTab,
  appLoadingScreen
} from "./ui/components.js";
const DAILY_TARGETS = {
  protein: 50,
  carbs: 250,
  fat: 65,
  fiber: 30,
  sugar: 50,
};
function assignButtonsTabs(){
  const parentNavs = document.querySelector('nav');
  const recipesBtn=document.querySelector('#recipes');
  const productsBtn=document.querySelector('#products');
  const foodLogBtn=document.querySelector('#food-log');
  const productsSection = document.querySelector("#products-section");
  const foodLogSection = document.querySelector("#foodlog-section");
  recipesBtn.addEventListener("click",()=>{disableSectionsExcept();enableHomeSection(); changeActiveTab(parentNavs,recipesBtn);history.replaceState({page: 1}, "", "/" + 'home');});
  productsBtn.addEventListener("click",()=>{disableSectionsExcept(productsSection);changeActiveTab(parentNavs,productsBtn);history.replaceState({page: 3}, "", "/" + 'products');});
  foodLogBtn.addEventListener("click",()=>{disableSectionsExcept(foodLogSection);changeActiveTab(parentNavs,foodLogBtn);history.replaceState({page: 4}, "", "/" + 'foodlog');});
}
async function displayRandomMeals() {
  let data = await getRandomMeals(25);
  displayRecipes(data);
}
let divRecipes = document.querySelector("#recipes-grid");
async function addAreas() {
  let divAreas = document.querySelector(".areas");
  const allRecipesBtn = document.querySelector("#allRecipesBtn");
  allRecipesBtn.addEventListener("click", () => {
    displayRandomMeals();
    changeActive(divAreas, allRecipesBtn);
  });
  const data = await getAreas();
  for (let { name } of data.results) {
    let btn = document.createElement("button");
    btn.setAttribute(
      "class",
      "px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all",
    );
    btn.innerHTML = name;
    btn.addEventListener("click", async () => {
      changeActive(divAreas, btn);
      showSpinner(divRecipes);
      let data = await getByArea(name);
      displayRecipes(data, name);
    });
    divAreas.append(btn);
  }
}
async function addMealTypes() {
  let divMealTypes = document.querySelector("#categories-grid");
  var data = await getMealTypes();
  for (let { name } of data.results) {
    let btnMeal = document.createElement("div");
    btnMeal.setAttribute(
      "class",
      "category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group",
    );
    btnMeal.setAttribute("data-category", name);
    btnMeal.innerHTML = ` <div class="flex items-center gap-2.5">
                <div
                  class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                  <i class="fa-solid fa-drumstick-bite"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900">${name}</h3>
                </div>
              </div>
              `;
    btnMeal.addEventListener("click", async () => {
      showSpinner(divRecipes);
      let data = await getByType(name);
      displayRecipes(data, name);
    });
    divMealTypes.append(btnMeal);
  }
}
async function displayRecipes(data, title) {
  const mealDetailsSection=document.querySelector("#meal-details");
  let recipesCount = document.querySelector("#recipes-count");
  let length = data.results.length;
  if (title !== undefined) {
    recipesCount.innerHTML = "Showing " + length + " " + title + " ";
  } else {
    recipesCount.innerHTML = "Showing " + length + " ";
  }
  recipesCount.innerHTML += "recipes";
  if (length === 0) {
    displayNotFound(divRecipes);
    return;
  } else {
    divRecipes.innerHTML = "";
  }
  const recipesCard = data.results
    .map(
      ({ name, category, thumbnail, area, instructions, id }) => ` 
    <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${id}">
      <div class="relative h-48 overflow-hidden">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${thumbnail}" alt="${name}" loading="lazy" />
        <div class="absolute bottom-3 left-3 flex gap-2">
          <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${category}</span>
          <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${area !== null ? area : "International"}</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${name}</h3>
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">${instructions}</p>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${category}</span>
          <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${area !== null ? area : "International"}</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
  divRecipes.innerHTML = recipesCard;
  for (const recipe of divRecipes.children) {
    recipe.addEventListener("click", () => {
      disableSectionsExcept(mealDetailsSection);
      history.replaceState({page: 2}, "", "/meal/" + recipe.dataset.mealId);
      displayMeal(recipe.dataset.mealId);
    });
  }
}
async function displayProducts(data, title,number) {
  const productsGrid=document.querySelector("#products-grid");
  let productsCount = document.querySelector("#products-count");
  let length = data.results.length;
  if (number) {
    productsCount.innerHTML = `Found product ${title}`;
  } else {
    productsCount.innerHTML = `Found ${length} products for "${title}"`;
  }
  productsCount.innerHTML += "recipes";
  if (length === 0) {
    displayNotFound(productsGrid);
    return;
  } else {
    productsGrid.innerHTML = "";
  }
  const productCard = data.results
    .map(
      ({ name, barcode,brand,image,nutritionGrade,novaGroup,nutrients}) => ` 
    <div
              class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-barcode="${barcode}">
              <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  src="${image}"
                  alt="${name}" loading="lazy" />

                <!-- Nutri-Score Badge -->
                <div
                  class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                  Nutri-Score ${nutritionGrade}
                </div>

                <!-- NOVA Badge -->
                <div
                  class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                  title="NOVA ${novaGroup}">
                  2
                </div>
              </div>

              <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                  ${brand}
                </p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  ${name}
                </h3>

                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span><i class="fa-solid fa-weight-scale mr-1"></i>250g</span>
                  <span><i class="fa-solid fa-fire mr-1"></i>350 kcal/100g</span>
                </div>

                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                  <div class="bg-emerald-50 rounded p-1.5">
                    <p class="text-xs font-bold text-emerald-700">${nutrients.protein}</p>
                    <p class="text-[10px] text-gray-500">Protein</p>
                  </div>
                  <div class="bg-blue-50 rounded p-1.5">
                    <p class="text-xs font-bold text-blue-700">${nutrients.carbs}</p>
                    <p class="text-[10px] text-gray-500">Carbs</p>
                  </div>
                  <div class="bg-purple-50 rounded p-1.5">
                    <p class="text-xs font-bold text-purple-700">${nutrients.fat}</p>
                    <p class="text-[10px] text-gray-500">Fat</p>
                  </div>
                  <div class="bg-orange-50 rounded p-1.5">
                    <p class="text-xs font-bold text-orange-700">${nutrients.sugar}</p>
                    <p class="text-[10px] text-gray-500">Sugar</p>
                  </div>
                </div>
              </div>
            </div>
  `,
    )
    .join("");
  productsGrid.innerHTML = productCard;
  // for (const recipe of productsGrid.children) {
  //   recipe.addEventListener("click", () => {
  //     disableSectionsExcept(mealDetailsSection);
  //     history.replaceState({page: 2}, "", "/meal/" + recipe.dataset.mealId);
  //     displayMeal(recipe.dataset.mealId);
  //   });
  // }
}
async function searchByName() {
  const input = document.querySelector("#search-input");
  input.addEventListener("input", async () => {
    if (input.value.length > 1) {
      showSpinner(divRecipes);
      let data = await getByName(input.value);
      displayRecipes(data, ` "${input.value}"`);
    } else if (input.value.length === 0) {
      displayRandomMeals();
    }
  });
}
async function searchProductByNameorCode() {
  const barcodeBtn = document.querySelector("#lookup-barcode-btn")
  const barcodeInput = document.querySelector("#barcode-input");
  const searchBtn = document.querySelector("#search-product-btn")
  const productInput = document.querySelector("#product-search-input");
  barcodeBtn.addEventListener('click',async () =>{
    let data = await getByProductName(barcodeInput.value);
  });
  searchBtnBtn.addEventListener('click',async () =>{
    let data = await getByProductName(productInput.value);
  });
}
async function getMealNutrition(mealRecipe) {
  const ingredientsJoin = mealRecipe.ingredients.map(
    ({ ingredient, measure }) => measure + " " + ingredient,
  );
  console.log(ingredientsJoin);
  const meal = { recipeName: mealRecipe.name, ingredients: ingredientsJoin };
  const jsonString = JSON.stringify(meal);
  console.log(jsonString);
  return await getNutrition(jsonString);
}
function displayTags(mealRecipe) {
  const divTags = heroDiv.querySelector("#divTags");
  const divTagsChildren = Array.from(divTags.children);
  divTagsChildren[0].innerHTML = mealRecipe.category;
  divTagsChildren[1].innerHTML =
    mealRecipe.area !== null ? mealRecipe.area : "International";
  for (let i = 2; i < divTagsChildren.length; i++) {
    divTagsChildren[i].remove();
  }
  const tags = mealRecipe.tags;
  if (tags && tags.length > 0) {
    for (let tag of tags) {
      const tagSpan = document.createElement("span");
      tagSpan.setAttribute(
        "class",
        "px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full",
      );
      tagSpan.innerHTML = tag;
      divTags.append(tagSpan);
    }
  }
}
function displayIngredients(ingredients) {
  const ingredientsCount = document.querySelector("#ingredientsCount");
  ingredientsCount.innerHTML = ingredients.length;
  const ingredientsList = document.querySelector("#ingredientsList");
  const ingCheckBox = ingredients
    .map(
      ({ ingredient, measure }) => ` 
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                  <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                  <span class="text-gray-700">
                    <span class="font-medium text-gray-900">${measure}</span> ${ingredient}
                  </span>
                </div>
  `,
    )
    .join("");
  ingredientsList.innerHTML = ingCheckBox;
}
function displayInstructions(instructions) {
  const instructionsList = document.querySelector("#instructionsList");
  const instruction = instructions
    .map(
      (instruction, idx) => ` 
    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    ${idx + 1}
                  </div>
                  <p class="text-gray-700 leading-relaxed pt-2">
                    ${instruction}
                  </p>
                </div>
  `,
    )
    .join("");
  instructionsList.innerHTML = instruction;
}
async function displayNutrition(nutrition) {
  const nutritionDetails = nutrition.data;
  console.log(nutrition);
  const servings = document.querySelector("#hero-servings");
  const calServing = document.querySelector("#hero-calories");
  const calPerServing = document.querySelector("#calories-per-serving");
  const totalCalories = document.querySelector("#total-calories");
  servings.innerHTML = nutritionDetails.servings;
  calServing.innerHTML = nutritionDetails.perServing.calories + " cal/serving";
  console.log(calPerServing)
  calPerServing.innerHTML = nutritionDetails.perServing.calories;
  totalCalories.innerHTML = nutritionDetails.totals.calories;
  const { perServing } = nutritionDetails;
  const facts = Object.fromEntries(
    Object.entries(DAILY_TARGETS).map(([macro, target]) => {
      const amount = perServing[macro];
      const percentage = Math.round((amount / target)*100) 
      return [macro, [amount,  percentage > 100 ?100:percentage]];
    }),
  );
  for (let [key, value] of Object.entries(facts)) {
    const macroGramsDiv = document.querySelector(`#${key}Value`);
    const macroWidthDiv = document.querySelector(`#${key}Width`);
    if (macroGramsDiv) macroGramsDiv.innerHTML = value[0];
    if (macroWidthDiv)
      macroWidthDiv.setAttribute("style", `width: ${value[1]}%`);
  }
}
async function displayMeal(id) {
  const data = await getById(id);
  const mealRecipe = data.result;
  const heroDiv = document.querySelector("#heroDiv");
  const img = heroDiv.querySelector("img");
  const video = document.querySelector("iframe");
  const title = heroDiv.querySelector("h1");
  const rawUrl = mealRecipe.youtube || "";
  const videoUrl =
    "https://www.youtube.com/embed/" + rawUrl.slice(rawUrl.indexOf("=") + 1);
  title.innerHTML = mealRecipe.name;
  img.setAttribute("src", mealRecipe.thumbnail);
  img.setAttribute("alt", mealRecipe.name);
  console.log(videoUrl);
  video.setAttribute("src", videoUrl);
  displayTags(mealRecipe);
  displayIngredients(mealRecipe.ingredients);
  displayInstructions(mealRecipe.instructions);
  const nutritionFactsContainer = document.querySelector(
    "#nutrition-facts-container",
  );
  removeNotFoundBefore(nutritionFactsContainer);
  disableNutritionFacts(nutritionFactsContainer);
  showSpinnerBefore(nutritionFactsContainer);
  try {
    const nutritionDetails = await getMealNutrition(mealRecipe);
    removeSpinnerBefore(nutritionFactsContainer);
    if (nutritionDetails && nutritionDetails.success === true) {
      enableNutritionFacts(nutritionFactsContainer);
      displayNutrition(nutritionDetails);
    } else {
      displayNotFound(nutritionFactsContainer, "nutrition facts");
    }
  } catch {
    console.log("failed to get nutrition details");
  }
}
appLoadingScreen();
disableSectionsExcept();
enableHomeSection();
assignButtonsTabs();
addAreas();
addMealTypes();
displayRandomMeals();
searchByName();
searchProductByNameorCode();
