import mongoose, { Schema } from "mongoose";
const recipeSchema = new Schema({
  name: { type: String, required: true },
  minutes: { type: String, required: true },
  tags: { type: [String], required: true },
  nutrition: { type: [Number], required: true },
  n_steps: { type: String, required: true },
  steps: { type: [String], required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  n_ingredients: { type: Number, required: true },
});

export const Recipe = mongoose.model("Recipe", recipeSchema);
