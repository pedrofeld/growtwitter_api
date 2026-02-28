"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const like_service_1 = require("../services/like.service");
const likeService = new like_service_1.LikeService();
class LikeController {
    // 1 - Like a tweet
    async like(req, res) {
        try {
            const { userId, tweetId } = req.params;
            if (!userId || !tweetId) {
                return res.status(400).json({
                    ok: false,
                    message: "User ID and Tweet ID are required",
                });
            }
            const like = await likeService.likeTweet({ userId, tweetId });
            res.status(200).json({
                ok: true,
                message: "Tweet liked successfully",
                data: like,
            });
        }
        catch (error) {
            res.status(400).json({
                ok: false,
                message: "Error liking tweet",
                error: error.message,
            });
        }
    }
    // 2 - Unlike a tweet
    async unlike(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    message: "Like ID is required",
                });
            }
            const deletedLike = await likeService.unlikeTweet(id);
            res.status(200).json({
                ok: true,
                message: "Like removed successfully",
                data: deletedLike,
            });
        }
        catch (error) {
            res.status(400).json({
                ok: false,
                message: "Error removing like",
                error: error.message,
            });
        }
    }
}
exports.LikeController = LikeController;
// OLD METHOD (NOT RECOMMENDED)
/*
    // Alerts:
    // - The following code is an older approach where the controller directly interacts with the repository layer.
    // - It is recommended to use the service layer (as shown above) for better separation of concerns and maintainability.

    import { UserRepository } from "../database/user.repository";
    import { TweetRepository } from "../database/tweet.repository";
    import { LikeRepository } from "../database/like.repository";
    import {
    authMiddleware,
    validateIdParam,
    validateLike,
    validateOwnership,
    } from "../config/middlewares";
    import app from "../app";

    const userRepository = new UserRepository();
    const tweetRepository = new TweetRepository();
    const likeRepository = new LikeRepository();

    // 1 - Like a tweet
    app.post('/like/:userId/:tweetId', authMiddleware, validateLike, validateOwnership('like'), async (req, res) => {
        try {
            const { userId, tweetId } = req.params;
            const user = userId as string;
            const tweet = tweetId as string;
            const tweetData = {
                userId: user,
                tweetId: tweet
            };
            const validUserId = await userRepository.findById(user)

            if (!validUserId){
                return res.status(400).json({
                    ok: false,
                    message: "User not found"
                });
            }
            
            const validTweetId = await tweetRepository.findById(tweet)

            if (!validTweetId){
                return res.status(400).json({
                    ok: false,
                    message: "Tweet not found"
                });
            }
            
            const newLike = await likeRepository.likeTweet(tweetData);

            if (!newLike){
                return res.status(400).json({
                    ok: false,
                    message: "You already liked this tweet"
                });
            }

            res.status(200).send({
                ok: true,
                message: "Tweet liked successfully:",
                data: newLike
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error liking tweet",
                error: error.message
            });
        }
    })

    // 2 - Unlike a tweet
    app.delete('/like/:id', authMiddleware, validateIdParam, validateOwnership('like'), async (req, res) => {
        try {
            const { id } = req.params;
            const likeId = id as string;

            const validLikeId = await likeRepository.findById(likeId)

            if (!validLikeId){
                return res.status(400).json({
                    ok: false,
                    message: "Like not found"
                });
            }

            const deletedLike = await likeRepository.unlikeTweet(likeId);

            res.status(200).send({
                ok: true,
                message: "Tweet deleted successfully:",
                data: deletedLike
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error deleting tweet",
                error: error.message
            });
        }
    })
*/ 
