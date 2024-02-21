import Joi from "joi";

const recipeSchema = Joi.object({
  name: Joi.string().required(),
  minutes: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required().min(1),
  nutrition: Joi.array().items(Joi.number()).required().length(7),
  n_steps: Joi.string().required(),
  steps: Joi.array().items(Joi.string()).required().min(1),
  description: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string()).required().min(1),
  n_ingredients: Joi.number().required(),
});

export { recipeSchema };
