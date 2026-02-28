"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tweet_controller_1 = require("../controllers/tweet.controller");
const middlewares_1 = require("../config/middlewares");
const tweetRoutes = (0, express_1.Router)();
const tweetController = new tweet_controller_1.TweetController();
// 1 - Get all tweets (non-mandatory method)
tweetRoutes.get("/tweets", tweetController.getAll);
// 2 - Create a tweet
tweetRoutes.post("/tweet", middlewares_1.authMiddleware, middlewares_1.validateTweetCreation, (0, middlewares_1.validateOwnership)("tweet"), tweetController.create);
// 3 - Update a tweet (non-mandatory method)
tweetRoutes.put("/tweet/:id", middlewares_1.authMiddleware, middlewares_1.validateIdParam, (0, middlewares_1.validateOwnership)("tweet"), tweetController.update);
// 4 - Delete a tweet (non-mandatory method)
tweetRoutes.delete("/tweet/:id", middlewares_1.authMiddleware, middlewares_1.validateIdParam, (0, middlewares_1.validateOwnership)("tweet"), tweetController.delete);
exports.default = tweetRoutes;
