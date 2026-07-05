/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
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
  getProductsCategories,
} from "./api/mealdb.js";
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
  appLoadingScreen,
  changeActiveGrade,
  displayEmptyFoodLog,
  enableLogRecipeBtn,
  disableLogRecipeBtn,
  displayWeeklyOverview,
} from "./ui/components.js";
const DAILY_TARGETS = {
  protein: 50,
  carbs: 250,
  fat: 65,
  fiber: 30,
  sugar: 50,
  calories: 2000,
};
function assignButtonsTabs() {
  const parentNavs = document.querySelector("nav");
  const recipesBtn = document.querySelector("#recipes");
  const productsBtn = document.querySelector("#products");
  const foodLogBtn = document.querySelector("#food-log");
  const productsSection = document.querySelector("#products-section");
  const foodLogSection = document.querySelector("#foodlog-section");
  const backToMealsBtn = document.querySelector("#back-to-meals-btn");
  recipesBtn.addEventListener("click", () => {
    disableSectionsExcept();
    enableHomeSection();
    changeActiveTab(parentNavs, recipesBtn);
    history.replaceState({ page: 1 }, "", "/" + "home");
  });
  backToMealsBtn.addEventListener("click", () => {
    disableSectionsExcept();
    enableHomeSection();
    changeActiveTab(parentNavs, recipesBtn);
    history.replaceState({ page: 1 }, "", "/" + "home");
  });
  productsBtn.addEventListener("click", () => {
    disableSectionsExcept(productsSection);
    changeActiveTab(parentNavs, productsBtn);
    history.replaceState({ page: 3 }, "", "/" + "products");
  });
  foodLogBtn.addEventListener("click", () => {
    disableSectionsExcept(foodLogSection);
    changeActiveTab(parentNavs, foodLogBtn);
    history.replaceState({ page: 4 }, "", "/" + "foodlog");
  });
}
async function displayRandomMeals() {
  let data = await getRandomMeals(25);
  try {
    displayRecipes(data);
  } catch (error) {
    console.log(error)
  }
  
}
let divRecipes = document.querySelector("#recipes-grid");
let retrievedProducts;
let currentQuery;
let foodLog = [];
let activeRecipe = null;
let activeProduct = null;
const productsGrid = document.querySelector("#products-grid");
class FoodItem {
  constructor(name, nutrients, thumbnail, loggedTime) {
    this.name = name;
    this.nutrients = nutrients;
    this.thumbnail = thumbnail;
    this.addedAt = loggedTime || new Date().toISOString();
    this.dateString = this.addedAt.split("T")[0];
  }
  getFormattedTime() {
    return new Date(this.addedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
class Product extends FoodItem {
  constructor(name, nutrients, thumbnail, barcode, brand, loggedTime) {
    super(name, nutrients, thumbnail, loggedTime);
    this.barcode = barcode;
    this.brand = brand;
    this.type = "Product";
  }
}
class Recipe extends FoodItem {
  constructor(name, nutrients, thumbnail, servings, loggedTime) {
    super(name, nutrients, thumbnail, loggedTime);
    this.brand = "Recipe";
    this.type = "Recipe";
    this.servings = servings;
  }
}
function saveFoodLog() {
  try {
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
  } catch (error) {
    console.log(error);
  }
}
function logFood(food, type) {
  console.log("Pushing into array:", food);
  foodLog.push(food);
  saveFoodLog();
  console.log({ foodLog });
  const currentTotal = calculateTotalIntake();
  updateIntakeUI(currentTotal);
  updateDashboard();
  displayFoodLog();
  window.alert(`${type} logged successfully`);
}
function handleLogRecipeClick() {
  if (activeRecipe) {
    logFood(activeRecipe, "recipe");
  }
}
function handleLogProductClick() {
  if (activeProduct) {
    logFood(activeProduct, "product");
  }
  closeModal();
}
function LogRecipeBtn(recipe) {
  const btn = document.querySelector("#log-meal-btn");
  activeRecipe = recipe;
  btn.removeEventListener("click", handleLogRecipeClick);
  btn.addEventListener("click", handleLogRecipeClick);
}
function LogProductBtn(product) {
  const btn = document.querySelector("#add-product-btn");
  activeProduct = product;
  btn.removeEventListener("click", handleLogProductClick);
  btn.addEventListener("click", handleLogProductClick);
}
function displayFoodLog() {
  const logContainer = document.querySelector("#logged-items-list");

  logContainer.innerHTML = foodLog
    .map(({ name, brand, type, addedAt, nutrients, thumbnail }, index) => {
      const formattedTime = new Date(addedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `
    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
      
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
          ${thumbnail ? `<img src="${thumbnail}" class="w-full h-full object-contain" alt="${name}"/>` : `<i class="fa-solid fa-box text-blue-600 text-xl"></i>`}
        </div>
        <div>
          <p class="font-semibold text-gray-900">${name}</p>
          <p class="text-sm text-gray-500">
            ${brand || "Unknown"} <span class="mx-1">•</span> <span class="text-blue-600">${type}</span>
          </p>
          <p class="text-xs text-gray-400 mt-1">${formattedTime}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-lg font-bold text-emerald-600">${Math.round(nutrients?.calories || 0)}</p>
          <p class="text-xs text-gray-500">kcal</p>
        </div>
        <div class="hidden md:flex gap-2 text-xs text-gray-500">
          <span class="px-2 py-1 bg-blue-50 rounded">${Math.round(nutrients?.protein || 0)}g P</span>
          <span class="px-2 py-1 bg-amber-50 rounded">${Math.round(nutrients?.carbs || 0)}g C</span>
          <span class="px-2 py-1 bg-purple-50 rounded">${Math.round(nutrients?.fat || 0)}g F</span>
        </div>
        
        <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>

    </div>
  `;
    })
    .join("");
  const removeButtons = logContainer.querySelectorAll(".remove-foodlog-item");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index, 10);
      removeItemFromLog(index);
    });
  });
}
export function loadFoodLog() {
  const savedData = localStorage.getItem("foodLog");
  if (!savedData) return;

  try {
    const rawArray = JSON.parse(savedData);
    foodLog = rawArray.map((item) => {
      if (item.type === "Product") {
        return new Product(
          item.name,
          item.nutrients,
          item.thumbnail,
          item.barcode,
          item.brand,
          item.addedAt,
        );
      } else {
        return new Recipe(
          item.name,
          item.nutrients,
          item.thumbnail,
          item.servings,
          item.addedAt,
        );
      }
    });
    const currentTotal = calculateTotalIntake();
    updateIntakeUI(currentTotal);
    updateDashboard();
    displayFoodLog();
  } catch (error) {
    console.error("Error parsing food log from localStorage:", error);
    displayEmptyFoodLog();
  }
}
function removeItemFromLog(index) {
  foodLog.splice(index, 1);
  saveFoodLog();
  const currentTotal = calculateTotalIntake();
  updateIntakeUI(currentTotal);
  updateDashboard();
  displayFoodLog();
}
function updateIntakeUI(totals) {
  console.log({totals});
  const loggedItemCount = document.querySelector("#logged-count");
  if (foodLog && foodLog.length > 0) {
    loggedItemCount.innerHTML = `Logged Items (${foodLog.length})`;
  } else {
    loggedItemCount.innerHTML = `Logged Items (0)`;
    displayEmptyFoodLog();
  }
  document.querySelector("#calories-today").innerHTML =
    `${Math.round(totals.calories)} / ${DAILY_TARGETS.calories} kcal`;
  document.querySelector("#protien-today").innerHTML =
    `${Math.round(totals.protein)} / ${DAILY_TARGETS.protein} g`;
  document.querySelector("#carbs-today").innerHTML =
    `${Math.round(totals.carbs)} / ${DAILY_TARGETS.carbs} g`;
  document.querySelector("#fat-today").innerHTML =
    `${Math.round(totals.fat)} / ${DAILY_TARGETS.fat} g`;

  document.querySelector("#calories-width-today").style.width =
    `${Math.min((totals.calories / DAILY_TARGETS.calories) * 100, 100)}%`;
  document.querySelector("#protien-width-today").style.width =
    `${Math.min((totals.protein / DAILY_TARGETS.protein) * 100, 100)}%`;
  document.querySelector("#carbs-width-today").style.width =
    `${Math.min((totals.carbs / DAILY_TARGETS.carbs) * 100, 100)}%`;
  document.querySelector("#fat-width-today").style.width =
    `${Math.min((totals.fat / DAILY_TARGETS.fat) * 100, 100)}%`;
}
function calculateTotalIntake() {
  return foodLog.reduce(
    (total, item) => {
      console.log(item.nutrients);
      total.calories += item.nutrients.calories;
      total.protein += item.nutrients.protein;
      total.carbs += item.nutrients.carbs;
      total.fat += item.nutrients.fat;
      return total;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
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
      try {
        displayRecipes(data, name);
      } catch (error) {
        console.log(err);
      }
      
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
      try{
        displayRecipes(data, name);
      }
      catch(err){
        console.log(err)
      }
    });
    divMealTypes.append(btnMeal);
  }
}
async function displayRecipes(data, title) {
  const mealDetailsSection = document.querySelector("#meal-details");
  let recipesCount = document.querySelector("#recipes-count");
  let length = data.results.length;
  if (title !== undefined) {
    recipesCount.innerHTML = "Showing " + length + " " + title + " ";
  } else {
    recipesCount.innerHTML = "Showing " + length + " ";
  }
  recipesCount.innerHTML += "recipes";
  if (length === 0) {
    displayNotFound(divRecipes,'recipes');
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
      history.replaceState({ page: 2 }, "", "/meal/" + recipe.dataset.mealId);
      displayMeal(recipe.dataset.mealId);
    });
  }
}
async function displayProducts(data, title = currentQuery, number) {
  let productsCount = document.querySelector("#products-count");
  let length = data.length;
  if (length === 0 ) {
    displayNotFound(productsGrid,'products');
    productsCount.innerHTML = `No products found in ${title} `;
    return;
  } else {
    productsGrid.innerHTML = "Found";
  }
  if (number) {
    productsCount.innerHTML = `product ${data[0].name}`;
  } else {
    productsCount.innerHTML = `${length} products for "${title}"`;
  }
  productsGrid.innerHTML = data
    .map(
      (
        { name, barcode, brand, image, nutritionGrade, novaGroup, nutrients },
        index,
      ) => ` 
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
         data-index="${index}"
         data-barcode="${barcode}">
      <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
             src="${image || "https://placehold.co/150?text=No+Image"}"
             alt="${name}" loading="lazy" />

        <div class="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded uppercase">
          Nutri-Score ${nutritionGrade || "N/A"}
        </div>

        <div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
             title="NOVA ${novaGroup || "0"}">
          ${novaGroup || "0"}
        </div>
      </div>

      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${brand || "Generic"}</p>
        <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${name}</h3>

        <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span><i class="fa-solid fa-weight-scale mr-1"></i>250g</span>
          <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(nutrients?.calories || 0)} kcal/100g</span>
        </div>

        <div class="grid grid-cols-4 gap-1 text-center">
          <div class="bg-emerald-50 rounded p-1.5">
            <p class="text-xs font-bold text-emerald-700">${Math.round(nutrients?.protein || 0)}</p>
            <p class="text-[10px] text-gray-500">Protein</p>
          </div>
          <div class="bg-blue-50 rounded p-1.5">
            <p class="text-xs font-bold text-blue-700">${Math.round(nutrients?.carbs || 0)}</p>
            <p class="text-[10px] text-gray-500">Carbs</p>
          </div>
          <div class="bg-purple-50 rounded p-1.5">
            <p class="text-xs font-bold text-purple-700">${Math.round(nutrients?.fat || 0)}</p>
            <p class="text-[10px] text-gray-500">Fat</p>
          </div>
          <div class="bg-orange-50 rounded p-1.5">
            <p class="text-xs font-bold text-orange-700">${Math.round(nutrients?.sugar || 0)}</p>
            <p class="text-[10px] text-gray-500">Sugar</p>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
  productsGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const index = card.dataset.index;
    const selectedProductData = data[index];
    if (selectedProductData) {
      openProductDetailModal(selectedProductData);
    }
  });
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
  const barcodeBtn = document.querySelector("#lookup-barcode-btn");
  const barcodeInput = document.querySelector("#barcode-input");
  const searchBtn = document.querySelector("#search-product-btn");
  const productInput = document.querySelector("#product-search-input");
  barcodeBtn.addEventListener("click", async () => {
    console.log("searching...");
    let data = await getProductByCode(barcodeInput.value);
    retrievedProducts = data.results;
    currentQuery = barcodeInput.value;
    if(retrievedProducts){
    displayProducts(retrievedProducts, barcodeInput.value, barcodeInput.value);
    console.log(data);
    }
    else{
      displayNotFound(productsGrid , 'products');
    }
  });
  searchBtn.addEventListener("click", async () => {
    let data = await getByProductName(productInput.value);
    retrievedProducts = data.results;
    currentQuery = productInput.value;
    if(retrievedProducts){
      displayProducts(retrievedProducts, productInput.value);
    }
    else{
      displayNotFound(productsGrid , "products");
    }
    console.log(data);
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
  console.log(calPerServing);
  calPerServing.innerHTML = nutritionDetails.perServing.calories;
  totalCalories.innerHTML = nutritionDetails.totals.calories;
  const { perServing } = nutritionDetails;
  const facts = Object.fromEntries(
    Object.entries(DAILY_TARGETS).map(([macro, target]) => {
      const amount = perServing[macro];
      const percentage = Math.round((amount / target) * 100);
      return [macro, [amount, percentage > 100 ? 100 : percentage]];
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
      enableLogRecipeBtn();
      let recipe = new Recipe(
        mealRecipe.name,
        nutritionDetails.data.perServing,
        mealRecipe.thumbnail,
        1,
      );
      LogRecipeBtn(recipe);
    } else {
      displayNotFound(nutritionFactsContainer, "nutrition facts");
      disableLogRecipeBtn();
    }
  } catch (err) {
    console.log("failed to get nutrition details,error:" + err);
  }
}
async function addCategories() {
  let productCategoriesDiv = document.querySelector("#product-categories");
  let productsGrid = document.querySelector("#products-grid");
  const data = await getProductsCategories();
  for (let { name, id } of data.results) {
    let btn = document.createElement("button");
    btn.setAttribute(
      "class",
      "product-category-btn px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-emerald-200 transition-all",
    );
    btn.innerHTML = `<i class="fa-solid fa-cookie mr-1.5"></i>${name}`;
    btn.addEventListener("click", async () => {
      showSpinner(productsGrid);
      let data = await getByProductCategory(id);
      retrievedProducts = data.results;
      currentQuery = name;
      displayProducts(retrievedProducts, name);
    });
    productCategoriesDiv.append(btn);
  }
}
async function filterByNutriScore(grade) {
  let filterdProducts = retrievedProducts.filter((product) => {
    if (grade === "") return true;
    return product.nutritionGrade === grade;
  });
  displayProducts(filterdProducts);
}
function assignNutriScoreButtons() {
  const buttons = document.querySelectorAll(".nutri-score-filter");
  for (let button of buttons) {
    button.addEventListener("click", () => {
      changeActiveGrade(buttons[0].parentElement, button);
      if (retrievedProducts) {
        filterByNutriScore(button.dataset.grade);
      }
    });
  }
}
function updateDashboard() {
  const currentWeekData = getCalculatedWeeklySummary(foodLog);
  displayWeeklyOverview(currentWeekData);
}
export function openProductDetailModal(product) {
  const container = document.getElementById("modal-container");
  const nutrients = product.nutrients || {};
  const name = product.name || "Unknown Product";
  const brand = product.brand || "Unknown Brand";
  const image = product.image || "";
  const barcode = product.barcode || "";
  const grade = (product.nutritionGrade || "E").toUpperCase();
  const nova = product.novaGroup || 4;
  const ingredients =
    product.ingredients || "Ingredients not available for this product.";
  const scoreConfig = {
    A: { color: "#22c55e", bg: "#22c55e20", text: "Excellent" },
    B: { color: "#84cc16", bg: "#84cc1620", text: "Good" },
    C: { color: "#eab308", bg: "#eab30820", text: "Average" },
    D: { color: "#f97316", bg: "#f9731620", text: "Poor" },
    E: { color: "#e63e11", bg: "#e63e1120", text: "Bad" },
  };
  const currentScore = scoreConfig[grade] || scoreConfig["E"];

  const novaConfig = {
    1: { text: "Unprocessed" },
    2: { text: "Processed culinary ingredients" },
    3: { text: "Processed" },
    4: { text: "Ultra-processed" },
  };
  const currentNovaText = novaConfig[nova]?.text || "Ultra-processed";

  container.innerHTML = `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" id="product-detail-modal">
      <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div class="p-6">
          
          <div class="flex items-start gap-6 mb-6">
            <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src="${image}" alt="${name}" class="w-full h-full object-contain">
            </div>
            <div class="flex-1">
              <p class="text-sm text-emerald-600 font-semibold mb-1">${brand}</p>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">${name}</h2>
              <p class="text-sm text-gray-500 mb-3">Standard Reference Serving</p>
              
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${currentScore.bg}">
                  <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${currentScore.color}">
                    ${grade}
                  </span>
                  <div>
                    <p class="text-xs font-bold" style="color: ${currentScore.color}">Nutri-Score</p>
                    <p class="text-[10px] text-gray-600">${currentScore.text}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #e63e1120">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #e63e11">
                    ${nova}
                  </span>
                  <div>
                    <p class="text-xs font-bold" style="color: #e63e11">NOVA</p>
                    <p class="text-[10px] text-gray-600">${currentNovaText}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button class="close-product-modal text-gray-400 hover:text-gray-600">
              <i class="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>
          
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-chart-pie text-emerald-600"></i>
              Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
            </h3>
            
            <div class="text-center mb-4 pb-4 border-b border-emerald-200">
              <p class="text-4xl font-bold text-gray-900">${Math.round(nutrients.calories || 0)}</p>
              <p class="text-sm text-gray-500">Calories</p>
            </div>
            
            <div class="grid grid-cols-4 gap-4">
              <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min((nutrients.protein || 0) * 2, 100)}%"></div>
                </div>
                <p class="text-lg font-bold text-emerald-600">${(nutrients.protein || 0).toFixed(1)}g</p>
                <p class="text-xs text-gray-500">Protein</p>
              </div>
              <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min((nutrients.carbs || 0) * 1.5, 100)}%"></div>
                </div>
                <p class="text-lg font-bold text-blue-600">${(nutrients.carbs || 0).toFixed(1)}g</p>
                <p class="text-xs text-gray-500">Carbs</p>
              </div>
              <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min((nutrients.fat || 0) * 2.5, 100)}%"></div>
                </div>
                <p class="text-lg font-bold text-purple-600">${(nutrients.fat || 0).toFixed(1)}g</p>
                <p class="text-xs text-gray-500">Fat</p>
              </div>
              <div class="text-center">
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min((nutrients.sugar || 0) * 2, 100)}%"></div>
                </div>
                <p class="text-lg font-bold text-orange-600">${(nutrients.sugar || 0).toFixed(1)}g</p>
                <p class="text-xs text-gray-500">Sugar</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i class="fa-solid fa-list text-gray-600"></i>
              Ingredients
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">${ingredients}</p>
          </div>
          
          <div class="flex gap-3">
            <button id ="add-product-btn" class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${barcode}">
              <i class="fa-solid fa-plus mr-2"></i>Log This Food
            </button>
            <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              Close
            </button>
          </div>
          
        </div>
      </div>
    </div>
  `;
  const closeModal = () => {
    container.innerHTML = "";
  };
  container.querySelectorAll(".close-product-modal").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
  document
    .getElementById("product-detail-modal")
    .addEventListener("click", (e) => {
      if (e.target.id === "product-detail-modal") closeModal();
    });
  console.log({ product });
  let productLog = new Product(
    product.name,
    product.nutrients,
    image,
    product.barcode,
    product.brand,
  );
  LogProductBtn(productLog);
}
export function getCalculatedWeeklySummary(foodLog) {
  const today = new Date();
  const currentDay = today.getDay();
  const daysSinceMonday = currentDay === 0 ? 6 : currentDay - 1;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    const dateKey = nextDay.toISOString().split('T')[0]; // "2026-07-05"
    const todayStr = today.toISOString().split('T')[0];
    const dayName = nextDay.toLocaleDateString('en-US', { weekday: 'short' });

    const matchLogs = foodLog.filter(log => log.dateString === dateKey);
    const dayTotals = matchLogs.reduce((acc, log) => {
      acc.kcal += (log.nutrients?.calories || 0) ;
      acc.items += 1;
      return acc;
    }, { kcal: 0, items: 0 });

    return {
      day: dayName,
      date: nextDay.getDate(),
      kcal: Math.round(dayTotals.kcal),
      items: dayTotals.items,
      isSelected: dateKey === todayStr
    };
  });
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
addCategories();
assignNutriScoreButtons();
displayEmptyFoodLog();
loadFoodLog();
updateDashboard();
