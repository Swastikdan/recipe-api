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
  try {
    const response = await db
      .collection("recipe")
      .find({ ingredients: { $all: ingredients } })
      .limit(100)
      .toArray();
    return response;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch recipes.");
  }
};
export { search, searchByName, searchByIngredients };