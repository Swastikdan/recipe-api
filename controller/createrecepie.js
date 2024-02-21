import { recipeSchema } from "../model/recipeSchema.js";
const createRecipe = async (db, recipe) => {
  try {
    // Validate the recipe against the schema
    const { error } = recipeSchema.validate(recipe);
    if (error) {
      throw new Error(`Validation error  ${error.details[0].message}`);
    }

    const response = await db.collection("recipe").insertOne(recipe);
    return response.insertedId;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to insert recipe.");
  }
};

export {createRecipe} ;