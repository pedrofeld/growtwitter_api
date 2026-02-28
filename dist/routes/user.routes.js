"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../config/middlewares");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = (0, express_1.Router)();
const controller = new user_controller_1.UserController();
// 1 - Get all users
userRoutes.get("/users", controller.getAll.bind(controller));
// 2 - Get user by ID
userRoutes.get("/user/:id", middlewares_1.authMiddleware, middlewares_1.validateIdParam, controller.getById.bind(controller));
// 3 - Create new user
userRoutes.post("/user", middlewares_1.validateUserCreation, controller.create.bind(controller));
// 4 - Update user
userRoutes.put("/user/:id", middlewares_1.authMiddleware, middlewares_1.validateIdParam, (0, middlewares_1.validateOwnership)('user'), controller.update.bind(controller));
// 5 - Delete user
userRoutes.delete("/user/:id", middlewares_1.authMiddleware, middlewares_1.validateIdParam, (0, middlewares_1.validateOwnership)('user'), controller.delete.bind(controller));
exports.default = userRoutes;
