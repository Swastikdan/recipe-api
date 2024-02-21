import express from "express";
import db from "../db/conn.js";
import {
  geRandomRecipes,
  getRecipeById,
  search,
  searchByName,
  searchByIngredients,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controller/apiController.js";
const router = express.Router();
const key = process.env.key;
// Route to get random recipes
router.get("/", async (req, res) => {
  // Limit the number of responses to a maximum of 50
  const n_response = Math.min(req.query.n || 1, 50);

  try {
    const recipes = await geRandomRecipes(db, n_response);
    res.json(recipes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch recipes." });
  }
});

// Route to get a recipe by ID
router.get("/search/:id", async (req, res) => {
  try {
    const recipe = await getRecipeById(db, req.params.id);
    res.json(recipe);
  } catch (error) {
    switch (error.message) {
      case "Invalid ID format.":
        return res.status(400).json({ message: error.message });
      case "No recipe found with the provided ID.":
        return res.status(404).json({ message: error.message });
      default:
        return res.status(500).json({ message: "Failed to fetch recipe." });
    }
  }
});

// Route to search recipes
router.get("/search", async (req, res) => {
  // Search by query
  if (req.query.q) {
    const recipes = await search(db, req.query.q);
    return res.json(recipes);
  }

  // Search by name
  if (req.query.n) {
    const recipes = await searchByName(db, req.query.n);
    return res.json(recipes);
  }

  // Search by ingredients
  if (req.query.i) {
    const recipes = await searchByIngredients(db, req.query.i.split(","));
    return res.json(recipes);
  }

  // If no valid search query is provided
  if (!req.query.q && !req.query.i && !req.query.n) {
    return res.status(400).json({ message: "No search query provided." });
  }

  return res.status(400).json({ message: "Invalid search query." });
});

router.post(`${key}/create`, async (req, res) => {
  try {
    const recipe = await createRecipe(db, req.body);
    res.json(recipe);
  } catch (error) {
    if (error.message.startsWith("Validation error:")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to insert recipe." });
  }
});

router.put(`${key}/update/:id`, async (req, res) => {
  try {
    const recipe = await updateRecipe(db, req.params.id, req.body);
    res.json(recipe);
  } catch (error) {
    if (error.message.startsWith("Validation error:")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to update recipe." });
  }
});

router.delete(`${key}/delete/:id`, async (req, res) => {
  try {
    const recipe = await deleteRecipe(db, req.params.id);
    res.json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete recipe." });
  }
});

export { router };
