import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";
import {
    authMiddleware,
    validateFollow,
    validateFollowOwnership,
} from "../config/middlewares";

const router = Router();
const followController = new FollowController();

// 1 - Get all follows
router.get("/follows", followController.getAll);

// 2 - Follow a user
router.post(
    "/follow",
    authMiddleware,
    validateFollow,
    validateFollowOwnership,
    followController.follow
);

// 3 - Unfollow a user
router.delete(
    "/unfollow",
    authMiddleware,
    validateFollowOwnership,
    followController.unfollow
);

export default router;