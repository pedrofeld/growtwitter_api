import { Router } from "express";
import { FeedController } from "../controllers/feed.controller";
import { authMiddleware } from "../config/middlewares";

const router = Router();
const feedController = new FeedController();

// 1 - Get user feed
router.get(
    "/feed", 
    authMiddleware, 
    feedController.get
);

export default router;