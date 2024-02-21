
import { ObjectId } from "mongodb";

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

// Function to build a search pipeline for MongoDB's aggregation framework
const buildSearchPipeline = (
  query,
  path,
  isAutocomplete = false,
  fuzzy = null
) => {
  const pipeline = [];

  // If a query is provided, add a $search stage to the pipeline
  if (query) {
    const searchStage = {
      $search: {
        index: "default",
        [isAutocomplete ? "autocomplete" : "text"]: {
          query: query,
          path: path,
        },
      },
    };

    // If autocomplete is enabled and a fuzzy option is provided, add it to the $search stage
    if (isAutocomplete && fuzzy) {
      searchStage.$search.autocomplete.fuzzy = fuzzy;
    }

    pipeline.push(searchStage);
  }

  // Add a $sort stage to sort the results by score and a $limit stage to limit the number of results
  pipeline.push({ $sort: { score: -1 } }, { $limit: 100 });

  return pipeline;
};

// Function to execute a search pipeline and return the results
const executeSearchPipeline = async (db, pipeline) => {
  try {
    const response = await db
      .collection("recipe")
      .aggregate(pipeline)
      .toArray();
    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch recipes.");
  }
};

// Function to search for recipes by name
const search = async (db, name) => {
  const pipeline = buildSearchPipeline(name, { wildcard: "*" });
  return executeSearchPipeline(db, pipeline);
};

// Function to search for recipes by name with autocomplete
const searchByName = async (db, name) => {
  const pipeline = buildSearchPipeline(name, "name", true, {
    maxEdits: 1,
  });
  return executeSearchPipeline(db, pipeline);
};

// Function to search for recipes by ingredients
const searchByIngredients = async (db, ingredients) => {
  const pipeline = buildSearchPipeline(
    ingredients.join(" "),
    "ingredients",
    true,
    { maxEdits: 1 }
  );
  return executeSearchPipeline(db, pipeline);
};

// Export the functions for use in other modules
export {
  geRandomRecipes,
  getRecipeById,
  search,
  searchByName,
  searchByIngredients,
};