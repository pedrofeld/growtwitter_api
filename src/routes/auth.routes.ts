import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateUserLogin } from "../config/middlewares";

const router = Router();
const authController = new AuthController();

// User login
router.post(
    "/login",
    validateUserLogin,
    authController.login
);

export default router;