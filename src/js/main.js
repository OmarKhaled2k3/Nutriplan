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
import { createElement } from "react";
import {
  getAreas,
  getMealTypes,
  getRandomMeals,
  getByArea,
  getByType,
  getByName,
  getById
} from "./retrieve.js";
import { showSpinner, displayNotFound, changeActive } from "./ui/components.js";
async function displayRandomMeals() {
  let data = await getRandomMeals(25);
  displayRecipes(data);
}
let divRecipes = document.querySelector("#recipes-grid");
async function addAreas() {
  let divAreas = document.querySelector(".areas");
  const allRecipesBtn = document.querySelector("#allRecipesBtn");
  allRecipesBtn.addEventListener("click",() => {displayRandomMeals();changeActive(divAreas,allRecipesBtn);});
  const data = await getAreas();
  for (let { name } of data.results) {
    let btn = document.createElement("button");
    btn.setAttribute(
      "class",
      "px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all",
    );
    btn.innerHTML = name;
    btn.addEventListener("click", async () => {
      changeActive(divAreas,btn);
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
  for(const recipe of divRecipes.children){
    
    recipe.addEventListener("click",()=>{displayMeal(recipe.dataset.mealId);});
  }
}
async function searchByname() {
  const input = document.querySelector("#search-input");
  input.addEventListener("input", async () => {
    if (input.value.length > 1) {
      showSpinner(divRecipes);
      let data = await getByName(input.value);
      displayRecipes(data, ` "${input.value}"`);
    }
    else if (input.value.length === 0){displayRandomMeals();}
  });
}
async function displayMeal(id){
const mealRecipe = await getById(id);
const heroDiv = querySelector("#heroDiv");
const img = heroDiv.querySelector('img');
const divTags = heroDiv.querySelector("#divTags");
const divTagsChildren = Array.from(divTags.children);
const title = heroDiv.querySelector('h1');
title.innerHTML = mealRecipe.name;
divTagsChildren[0].innerHTML=mealRecipe.category;
divTagsChildren[1].innerHTML=mealRecipe.area !== null ? mealRecipe.area : "International";
for (let i=2;i<divTagsChildren.length;i++) {
  divTagsChildren[i].remove();
}
const tags = mealRecipe.tags;
img.setAttribute("src",mealRecipe.thumbnail);
if(tags && tags.length>0){
  for(let tag of tags ){
    const tagSpan = createElement("span");
    tagSpan.setAttribute("class","px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full");
    tagSpan.innerHTML=tag;
    divTags.append(tagSpan);
  }
}
}
addAreas();
addMealTypes();
displayRandomMeals();
searchByname();
