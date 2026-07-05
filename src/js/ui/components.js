// =========== Loading Spinner Design ============
/*
<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>
*/

// =========== Empty State Design ============
/*
<div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No recipes found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
*/
export function appLoadingScreen(){
  window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app-loading-overlay').classList.add('loading'); // Or adds 'hidden'
});
}
export function showSpinner(element) {
  element.innerHTML = `
    <div class="flex items-center justify-center py-12 w-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  `;
}
export function showSpinnerBefore(element) {
  if(element.parentElement.querySelector('.spinner') === null){
    const spinner = document.createElement('div');
  spinner.setAttribute('class',`flex items-center justify-center py-12 w-full spinner`)
  spinner.innerHTML = `
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  `;
  element.before(spinner);
  }
}
export function removeSpinnerBefore(element) {
  const divSpinner = element.parentElement.querySelector('.spinner');
  if(divSpinner){
    divSpinner.remove();
  }
}
export function displayNotFound(element,title='recipes') {
  element.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No ${title} found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
    `;
}
export function displayNotFoundBefore(element) {
  if(element.parentElement.querySelector('.not-found') === null){
    const notFound = document.createElement('div');
  notFound.setAttribute('class',`flex flex-col items-center justify-center py-12 text-center not-found`)
  notFound.innerHTML = `
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No nutrition facts found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
  `;
  element.before(notFound);
  }
}
export function removeNotFoundBefore(element) {
  const divMessage = element.parentElement.querySelector('.not-found');
  if(divMessage){
    divMessage.remove();
  }
}
export function changeActive(divButtons, clickedButton) {
  const currentActive = divButtons.querySelector(".bg-emerald-600");

  if (currentActive) {
    currentActive.classList.replace("bg-emerald-600", "bg-gray-100");
    currentActive.classList.replace("text-white", "text-gray-700");
  }
  clickedButton.classList.replace("bg-gray-100","bg-emerald-600");
  clickedButton.classList.replace("text-gray-700","text-white");
}
export function changeActiveTab(navTabs, clickedTab) {
  const currentActive = navTabs.querySelector(".bg-emerald-50");

  if (currentActive) {
    currentActive.classList.replace("bg-emerald-50", "hover:bg-gray-50");
    currentActive.classList.replace("text-emerald-700", "text-gray-600");
  }
  clickedTab.classList.replace("hover:bg-gray-50","bg-emerald-50");
  clickedTab.classList.replace("text-gray-600","text-emerald-700");
}
export function changeActiveGrade(navTabs, clickedTab) {
  const currentActive = navTabs.querySelector(".border-2");

  if (currentActive) {
    currentActive.classList.remove("border-2");
  }
  clickedTab.classList.add("border-2");
}
export function disableNutritionFacts(nutritionFactsContainer) {
  const active = nutritionFactsContainer.classList.contains("hidden");
  if (!active) {
    nutritionFactsContainer.classList.add("hidden");
  }
}
export function enableNutritionFacts(nutritionFactsContainer) {
  const active = nutritionFactsContainer.classList.contains("hidden");
  console.log({active});
  if (active ) {
    nutritionFactsContainer.classList.remove("hidden");
  }
}
export function disableSectionsExcept(currentSection){
  window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
  const sections = document.querySelectorAll('section');
  for(const section of sections){
    section.classList.add('hidden')
  }
  if(currentSection){
    currentSection.classList.remove('hidden');
  }
}
export function enableHomeSection(){
  const sections = document.querySelectorAll('section');
  for(let i =0;i<3;i++){
    sections[i].classList.remove('hidden')
  }
}
export function displayEmptyFoodLog() {
  document.querySelector("#logged-items-list").innerHTML = `
    <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">
                  Add meals from the Meals page or scan products
                </p>
              </div>
    `;
}
export function enableLogRecipeBtn(){
  const btn = document.querySelector("#log-meal-btn");
  if(btn.classList.contains("hidden")){
    btn.classList.remove('hidden');
  }
}
export function disableLogRecipeBtn(){
  const btn = document.querySelector("#log-meal-btn");
  if(!btn.classList.contains("hidden")){
    btn.classList.add('hidden');
  }
}
export function displayWeeklyOverview(dataArray) {
  // Target the updated grid element ID
  const container = document.querySelector("#weekly-overview-grid");
  if (!container) return;

  container.innerHTML = dataArray.map(item => {
    // 1. Check if this specific card is today's active highlighted day
    const cardClasses = item.isSelected 
      ? "text-center bg-indigo-100 rounded-xl p-2" 
      : "text-center p-2";

    // 2. Select the color scheme for the calorie section based on data state
    const kcalContainerClass = item.isSelected 
      ? "mt-2 text-emerald-600" 
      : (item.kcal > 0 ? "mt-2 text-emerald-600" : "mt-2 text-gray-300");

    return `
      <div class="${cardClasses}">
        <p class="text-xs text-gray-500 mb-1">${item.day}</p>
        <p class="text-sm font-medium text-gray-900">${item.date}</p>
        
        <div class="${kcalContainerClass}">
          <p class="text-lg font-bold">${item.kcal}</p>
          <p class="text-xs">kcal</p>
        </div>
        
        ${item.items > 0 ? `<p class="text-xs text-gray-400 mt-1">${item.items} items</p>` : ''}
      </div>
    `;
  }).join("");
}
