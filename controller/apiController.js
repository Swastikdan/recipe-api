import { ObjectId } from "mongodb";
import { search, searchByName, searchByIngredients } from "./search.js";
import { createRecipe } from "./createrecepie.js";
import { updateRecipe } from "./updaterecipe.js";
import { deleteRecipe } from "./deleterecipe.js";
// Function to get random recipes
const geRandomRecipes = async (db, n_response) => {
  try {
    // Use MongoDB's aggregation framework to get a random sample of recipes
    const response = await db
      .collection("recipe")
      .aggregate([{ $sample: { size: n_response } }])
      .toArray();
    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch recipes.");
  }
};

// Function to get a recipe by its ID
const getRecipeById = async (db, id) => {
  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ID format.");
  }
  try {
    // Find the recipe with the provided ID
    const response = await db
      .collection("recipe")
      .findOne({ _id: new ObjectId(id) });
    if (!response) {
      throw new Error("No recipe found with the provided ID.");
    }
    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch recipe.");
  }
};

export {
  geRandomRecipes,
  getRecipeById,
  search,
  searchByName,
  searchByIngredients,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
