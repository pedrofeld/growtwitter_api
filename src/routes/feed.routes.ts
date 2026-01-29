import { Router } from "express";
import { FeedController } from "../controllers/feed.controller";
import { authMiddleware } from "../config/middlewares";

const feedRoutes = Router();
const feedController = new FeedController();

// 1 - Get user feed
feedRoutes.get(
    "/feed", 
    authMiddleware, 
    feedController.get
);

export default feedRoutes;