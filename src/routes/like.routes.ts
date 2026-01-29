import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import {
    authMiddleware,
    validateIdParam,
    validateLike,
    validateOwnership,
} from "../config/middlewares";

const likeRoutes = Router();
const likeController = new LikeController();

// 1 - Like a tweet
likeRoutes.post(
    "/like/:userId/:tweetId",
    authMiddleware,
    validateLike,
    validateOwnership("like"),
    likeController.like
);

// 2 - Unlike a tweet
likeRoutes.delete(
    "/like/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership("like"),
    likeController.unlike
);

export default likeRoutes;