"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const middlewares_1 = require("../config/middlewares");
const authRoutes = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// User login
authRoutes.post("/login", middlewares_1.validateUserLogin, authController.login);
exports.default = authRoutes;
