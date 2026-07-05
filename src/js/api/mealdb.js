//import { API_KEY } from "./config.js";
const API_KEY = "JS180y3rPVkucEKz5VNIM6rkHMsHcFrza2ewThfO";
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
export async function getNutrition(jsonString){
    const url = `https://nutriplan-api.vercel.app/api/nutrition/analyze`;
    let response = await fetch(url,{
        method:"POST",
        headers:{
            'x-api-key': API_KEY ,
            'Content-Type': 'application/json'
        },
        body: jsonString
    });
    const data = await response.json();
    return data;
}
export async function getProductsCategories(){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/products/categories?page=1&limit=25`)
    const data = await response.json();
    return data;
}
export async function getByProductCategory(category){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/products/category/${category}?page=1&limit=24`)
    const data = await response.json();
    return data;
}
export async function getByProductName(name){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/products/search?q=${name}`)
    const data = await response.json();
    return data;
}
export async function getProductByCode(code){
    let response = await fetch(`https://nutriplan-api.vercel.app/api/products/barcode/${code}`)
    const data = await response.json();
    return data;
}