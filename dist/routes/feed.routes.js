"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feed_controller_1 = require("../controllers/feed.controller");
const middlewares_1 = require("../config/middlewares");
const feedRoutes = (0, express_1.Router)();
const feedController = new feed_controller_1.FeedController();
// 1 - Get user feed
feedRoutes.get("/feed", middlewares_1.authMiddleware, feedController.get);
exports.default = feedRoutes;
