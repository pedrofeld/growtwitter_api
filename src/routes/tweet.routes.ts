import { Router } from "express";
import { TweetController } from "../controllers/tweet.controller";
import {
    authMiddleware,
    validateTweetCreation,
    validateIdParam,
    validateOwnership,
} from "../config/middlewares";

const tweetRoutes = Router();
const tweetController = new TweetController();

// 1 - Get all tweets (non-mandatory method)
tweetRoutes.get(
    "/tweets",
    tweetController.getAll
);

// 2 - Create a tweet
tweetRoutes.post(
    "/tweet",
    authMiddleware,
    validateTweetCreation,
    validateOwnership("tweet"),
    tweetController.create
);

// 3 - Update a tweet (non-mandatory method)
tweetRoutes.put(
    "/tweet/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership("tweet"),
    tweetController.update
);

// 4 - Delete a tweet (non-mandatory method)
tweetRoutes.delete(
    "/tweet/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership("tweet"),
    tweetController.delete
);

export default tweetRoutes;