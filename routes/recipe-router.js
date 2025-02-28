const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { createRecipe, getRecipe, updatePost } = require("../controllers/recipe-controllers");
const recipeRouter = express.Router();
const upload = require('../middlewares/upload')

recipeRouter.get('/recipes/:id', getRecipe);
recipeRouter.post('/recipes/create-recipe',authenticate,upload.single('image'), createRecipe);
recipeRouter.patch('/recipes/update-recipe/:id',authenticate, updatePost);
recipeRouter.delete('/recipes/:id',authenticate, () => {});


module.exports = recipeRouter