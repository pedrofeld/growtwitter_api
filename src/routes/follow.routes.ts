import { Router } from "express";
import { FollowController } from "../controllers/follow.controller";
import {
    authMiddleware,
    validateFollow,
    validateFollowOwnership,
} from "../config/middlewares";

const followRoutes = Router();
const followController = new FollowController();

// 1 - Get all follows
followRoutes.get("/follows", followController.getAll);

// 2 - Follow a user
followRoutes.post(
    "/follow",
    authMiddleware,
    validateFollow,
    validateFollowOwnership,
    followController.follow
);

// 3 - Unfollow a user
followRoutes.delete(
    "/unfollow",
    authMiddleware,
    validateFollowOwnership,
    followController.unfollow
);

export default followRoutes;