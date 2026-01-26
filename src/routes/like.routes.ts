import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import {
    authMiddleware,
    validateIdParam,
    validateLike,
    validateOwnership,
} from "../config/middlewares";

const router = Router();
const likeController = new LikeController();

// 1 - Like a tweet
router.post(
    "/like/:userId/:tweetId",
    authMiddleware,
    validateLike,
    validateOwnership("like"),
    likeController.like
);

// 2 - Unlike a tweet
router.delete(
    "/like/:id",
    authMiddleware,
    validateIdParam,
    validateOwnership("like"),
    likeController.unlike
);

export default router;