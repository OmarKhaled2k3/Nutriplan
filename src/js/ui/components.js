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
