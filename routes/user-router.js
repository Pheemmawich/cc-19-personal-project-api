const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { updateRole, listUsers, deleteUser } = require("../controllers/user-controllers");
const userRouter = express.Router();

userRouter.get('/users',authenticate, listUsers);
userRouter.patch('/user/update-role',authenticate, updateRole);
userRouter.delete("/user/:id",authenticate, deleteUser)

module.exports = userRouter