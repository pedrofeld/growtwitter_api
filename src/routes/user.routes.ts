import { Router } from "express";
import {
    authMiddleware,
    validateUserCreation,
    validateIdParam,
    validateOwnership,
    validateUserLogin
} from "../config/middlewares";
import { UserController } from "../controllers/user.controller";

const routes = Router();
const controller = new UserController();

// 1 - Get all users
routes.get(
    "/users",
    controller.getAll.bind(controller)
);

// 2 - Get user by ID
routes.get(
    "/user/:id",
    authMiddleware,
    validateIdParam,
    controller.getById.bind(controller)
);

// 3 - Create new user
routes.post(
    "/user",
    validateUserCreation,
    controller.create.bind(controller)
);

// 4 - Update user
routes.put(
    "/user/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership,
    controller.update.bind(controller)
);

// 5 - Delete user
routes.delete(
    "/user/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership,
    controller.delete.bind(controller)
);

// 6 - User login
routes.post(
    "/login",
    validateUserLogin,
    controller.login.bind(controller)
);

export default routes;