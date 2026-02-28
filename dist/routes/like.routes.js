"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const like_controller_1 = require("../controllers/like.controller");
const middlewares_1 = require("../config/middlewares");
const likeRoutes = (0, express_1.Router)();
const likeController = new like_controller_1.LikeController();
// 1 - Like a tweet
likeRoutes.post("/like/:userId/:tweetId", middlewares_1.authMiddleware, middlewares_1.validateLike, (0, middlewares_1.validateOwnership)("like"), likeController.like);
// 2 - Unlike a tweet
likeRoutes.delete("/like/:id", middlewares_1.authMiddleware, middlewares_1.validateIdParam, (0, middlewares_1.validateOwnership)("like"), likeController.unlike);
exports.default = likeRoutes;
