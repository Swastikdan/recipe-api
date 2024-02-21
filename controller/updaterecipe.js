import { recipeSchema } from "../model/recipeSchema.js";
import { ObjectId } from "mongodb";

const updateRecipe = async (db, id, recipe) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { message: "Invalid ID format." };
    }

    if (Object.keys(recipe).length === 0) {
      return { message: "No data provided." };
    }

    const { error } = recipeSchema.validate(recipe);
    if (error) {
      return { message: `Validation error: ${error.details[0].message}` };
    }

    const response = await db
      .collection("recipe")
      .updateOne({ _id: new ObjectId(id) }, { $set: recipe });

    if (response.matchedCount === 0) {
      return { message: "No recipe found with the provided ID." };
    }

    return { message: "Recipe updated successfully." };
  } catch (e) {
    console.error(e);
    return { message: "Failed to update recipe." };
  }
};

export { updateRecipe };
