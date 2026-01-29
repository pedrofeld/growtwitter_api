import { Router } from "express";
import {
    authMiddleware,
    validateUserCreation,
    validateIdParam,
    validateOwnership,
    validateUserLogin
} from "../config/middlewares";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const controller = new UserController();

// 1 - Get all users
userRoutes.get(
    "/users",
    controller.getAll.bind(controller)
);

// 2 - Get user by ID
userRoutes.get(
    "/user/:id",
    authMiddleware,
    validateIdParam,
    controller.getById.bind(controller)
);

// 3 - Create new user
userRoutes.post(
    "/user",
    validateUserCreation,
    controller.create.bind(controller)
);

// 4 - Update user
userRoutes.put(
    "/user/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership,
    controller.update.bind(controller)
);

// 5 - Delete user
userRoutes.delete(
    "/user/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership,
    controller.delete.bind(controller)
);

export default userRoutes;