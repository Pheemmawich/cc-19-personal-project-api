const express = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  updateRole,
  listUsers,
  deleteUser,
  getuserById,
  getTopCreator,
} = require("../controllers/user-controllers");
const userRouter = express.Router();

userRouter.get("/user/creator/top-10", getTopCreator);

userRouter.get("/user/:id", getuserById);
userRouter.get("/users", authenticate, listUsers);
userRouter.patch("/user/update-role", authenticate, updateRole);
userRouter.delete("/user/:id", authenticate, deleteUser);

module.exports = userRouter;
