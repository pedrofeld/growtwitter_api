import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateUserLogin } from "../config/middlewares";

const authRoutes = Router();
const authController = new AuthController();

// User login
authRoutes.post(
    "/login",
    validateUserLogin,
    authController.login
);

export default authRoutes;