const express = require("express");
const authenticate = require("../middlewares/authenticate");
const recipeRouter = express.Router();

recipeRouter.get('/recipes/:id', () => {});
recipeRouter.post('/recipes/create-recipe',authenticate, () => {});
recipeRouter.patch('/recipes/update-recipe',authenticate, () => {});
recipeRouter.delete('/recipes/:id',authenticate, () => {});


module.exports = recipeRouter