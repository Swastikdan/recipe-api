import { ObjectId } from "mongodb";

const deleteRecipe = async (db, id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { message: "Invalid ID format." };
    }

    const recipe = await db
      .collection("recipe")
      .findOne({ _id: new ObjectId(id) });
    if (!recipe) {
      return { message: "Recipe not found." };
    }

    await db.collection("recipe").deleteOne({ _id: new ObjectId(id) });
    return { message: "Deleted" };
  } catch (e) {
    console.error(e);
    return { message: "Failed to delete recipe." };
  }
};

export { deleteRecipe };