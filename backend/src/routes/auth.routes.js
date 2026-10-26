const express = require("express");
const authController = require("../controllers/auth.controller");
const tokenBlacklistModel = require("../models/blacklist.model");
const authMiddleware = require("../middlewares/auth.middleware");


const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerUser);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */

authRouter.post("/login", authController.loginUser);

/** * @route GET /api/auth/logout
 * @description clear token from user cookies and add it to the blacklist
 * @access Public
 */

authRouter.get("/logout", authController.logoutUser);


/** * @route GET /api/auth/get-me
 * @description get the logged in user details
 * @access Private
 */

authRouter.get("/get-me", authMiddleware.authenticateToken, authController.getMe);



module.exports = authRouter;