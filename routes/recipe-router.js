const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  createRecipe,
  getRecipe,
  updatePost,
  deleteRecipe,
  getAllRecipesByuserId,
  getRecommendRecipe,
  getRecipeByIngredient,
  getAllMyRecipes,
  getRecipeByUserId,
  getRecipeByCategory,
} = require("../controllers/recipe-controllers");
const recipeRouter = express.Router();
const upload = require("../middlewares/upload");

recipeRouter.get("/recipes/by-category/:category", getRecipeByCategory);
recipeRouter.post("/recipes/by-ingredient", getRecipeByIngredient);
recipeRouter.get("/recipes/recommend", getRecommendRecipe);
recipeRouter.get("/recipes", authenticate, getAllMyRecipes);
recipeRouter.get("/recipes/:id", getRecipe);
recipeRouter.get("/recipes/by-userId/:id", getRecipeByUserId);

recipeRouter.post(
  "/recipes/create-recipe",
  authenticate,
  upload.single("image"),
  createRecipe
);
recipeRouter.patch(
  "/recipes/update-recipe/:id",
  authenticate,
  upload.single("image"),
  updatePost
);
recipeRouter.delete("/recipes/:id", authenticate, deleteRecipe);

module.exports = recipeRouter;
