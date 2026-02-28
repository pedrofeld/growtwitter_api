"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_controller_1 = require("../controllers/follow.controller");
const middlewares_1 = require("../config/middlewares");
const followRoutes = (0, express_1.Router)();
const followController = new follow_controller_1.FollowController();
// 1 - Get all follows
followRoutes.get("/follows", followController.getAll);
// 2 - Follow a user
followRoutes.post("/follow", middlewares_1.authMiddleware, middlewares_1.validateFollow, middlewares_1.validateFollowOwnership, followController.follow);
// 3 - Unfollow a user
followRoutes.delete("/unfollow", middlewares_1.authMiddleware, middlewares_1.validateFollowOwnership, followController.unfollow);
exports.default = followRoutes;
