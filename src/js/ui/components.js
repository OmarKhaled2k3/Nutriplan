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
export function displayNotFound(element) {
  element.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No recipes found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
    `;
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
