"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const feed_service_1 = require("../services/feed.service");
const feedService = new feed_service_1.FeedService();
class FeedController {
    async get(req, res) {
        try {
            const authenticatedUser = req.user;
            const userId = authenticatedUser.id;
            const feed = await feedService.getFeed(userId);
            res.status(200).json({
                ok: true,
                message: "User feed retrieved successfully",
                data: feed,
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error fetching feed",
                error: error.message,
            });
        }
    }
}
exports.FeedController = FeedController;
// OLD METHOD (NOT RECOMMENDED)
/*
    import { TweetRepository } from "../database/tweet.repository";
    import {
    authMiddleware,
    } from "../config/middlewares";
    import app from "../app";

    const tweetRepository = new TweetRepository();

    // 1 - Get user feed
    app.get('/feed', authMiddleware, async (req, res) => {
        try {
            const authenticatedUser = (req as any).user;
            const userId = authenticatedUser.id;

            const feed = await tweetRepository.findFeed(userId);

            res.status(200).send({
                ok: true,
                message: "User feed retrieved successfully",
                data: feed
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error fetching feed",
                error: error.message
            });
        }
    });
*/ 
