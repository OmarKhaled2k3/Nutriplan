export async function getAreas(){
    let response = await fetch("https://nutriplan-api.vercel.app/api/meals/areas")
    const data = await response.json();
    return data;
}
export async function getMealTypes(){
    let response = await fetch("https://nutriplan-api.vercel.app/api/meals/categories")
    const data = await response.json();
    return data;
}
export async function getRandomMeals(count){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/random?count=${count}`)
    const data = await response.json();
    return data;
}
export async function getByArea(area){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?area=${area}&limit=25}`)
    const data = await response.json();
    return data;
}
export async function getByType(type){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/filter?category=${type}&limit=25}`)
    const data = await response.json();
    return data;
}
export async function getByName(name){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${name}`)
    const data = await response.json();
    return data;
}
export async function getById(id){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`)
    const data = await response.json();
    return data;
}