const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth-controllers");
const { validateWithZod, registerSchema, loginSchema } = require("../middlewares/validator");
const authenticate = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");



// @ENDPOINT http://localhost:8000/api/register
authRouter.post('/register',validateWithZod(registerSchema) , authController.register );
authRouter.post('/login',validateWithZod(loginSchema) , authController.login );
authRouter.get('/getme', authenticate, authController.currentUser );
authRouter.patch('/update-profile', authenticate, upload.single('profileImage'), authController.updateProfile );

// export
module.exports = authRouter;