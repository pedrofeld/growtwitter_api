"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetController = void 0;
const tweet_service_1 = require("../services/tweet.service");
const tweetService = new tweet_service_1.TweetService();
class TweetController {
    // 1 - Get all tweets (non-mandatory method)
    async getAll(req, res) {
        try {
            const tweets = await tweetService.getAllTweets();
            res.status(200).json({
                ok: true,
                message: "All tweets:",
                data: tweets,
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error fetching tweets",
                error: error.message,
            });
        }
    }
    // 2 - Create a tweet
    async create(req, res) {
        try {
            const newTweet = await tweetService.createTweet(req.body);
            res.status(201).json({
                ok: true,
                message: "Tweet created successfully:",
                data: newTweet,
            });
        }
        catch (error) {
            res.status(400).json({
                ok: false,
                message: "Error creating tweet",
                error: error.message,
            });
        }
    }
    // 3 - Update a tweet (non-mandatory method)
    async update(req, res) {
        try {
            const { id } = req.params;
            const content = req.body;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    message: "Tweet ID is required",
                });
            }
            const updatedTweet = await tweetService.updateTweet(id, content);
            res.status(200).json({
                ok: true,
                message: "Tweet updated successfully:",
                data: updatedTweet,
            });
        }
        catch (error) {
            res.status(400).json({
                ok: false,
                message: "Error updating tweet",
                error: error.message,
            });
        }
    }
    // 4 - Delete a tweet (non-mandatory method)
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    message: "Tweet ID is required",
                });
            }
            const deletedTweet = await tweetService.deleteTweet(id);
            res.status(200).json({
                ok: true,
                message: "Tweet deleted successfully:",
                data: deletedTweet,
            });
        }
        catch (error) {
            res.status(400).json({
                ok: false,
                message: "Error deleting tweet",
                error: error.message,
            });
        }
    }
}
exports.TweetController = TweetController;
// OLD METHOD (NOT RECOMMENDED)
/*
    // Alerts:
    // - The following code is an older approach where the controller directly interacts with the repository layer.
    // - It is recommended to use the service layer (as shown above) for better separation of concerns and maintainability.

    import { TweetRepository } from "../database/tweet.repository";
    import { UserRepository } from "../database/user.repository";
    import {
    authMiddleware,
    validateTweetCreation,
    validateIdParam,
    validateOwnership,
    } from "../config/middlewares";
    import app from "../app";

    const tweetRepository = new TweetRepository();
    const userRepository = new UserRepository();

    // 1 - Get all tweets (non-mandatory method)
    app.get('/tweets', async (req, res) => {
        try {
            const tweets = await tweetRepository.findAll()
            res.status(200).send({
                ok: true,
                message: "All tweets:",
                data: tweets
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error fetching tweets",
                error: error.message
            })
        }
    })

    // 2 - Create a tweet
    app.post('/tweet', authMiddleware, validateTweetCreation, validateOwnership('tweet'), async (req, res) => {
        try {
            const tweetData = req.body;

            if (tweetData.userId){
                const validUserId = await userRepository.findById(tweetData.userId)

                if (!validUserId){
                    return res.status(400).json({
                        ok: false,
                        message: "User not found"
                    });
                }
            }

            const newTweet = await tweetRepository.createTweet(tweetData);

            res.status(201).send({
                ok: true,
                message: "Tweet created successfully:",
                data: newTweet
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error creating tweet",
                error: error.message
            })
        }
    })

    // 3 - Update a tweet (non-mandatory method)
    app.put('/tweet/:id', authMiddleware, validateIdParam, validateOwnership('tweet'), async (req, res) => {
        try {
            const { id } = req.params;
            const tweetId = id as string;
            const tweetData = req.body;
            const validTweetId = await tweetRepository.findById(tweetId)

            if (!validTweetId){
                return res.status(400).json({
                    ok: false,
                    message: "Tweet not found"
                });
            }
            
            if (!tweetData.content){
                return res.status(400).json({
                    ok: false,
                    message: "No content added"
                });
            }

            const updatedTweet = await tweetRepository.update(tweetId, tweetData);

            res.status(200).send({
                ok: true,
                message: "Tweet updated successfully:",
                data: updatedTweet
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error updating user",
                error: error.message
            });
        }
    })

    // 4 - Delete a tweet (non-mandatory method)
    app.delete('/tweet/:id', authMiddleware, validateIdParam, validateOwnership('tweet'), async (req, res) => {
        try {
            const { id } = req.params;
            const tweetId = id as string;
            const validTweetId = await tweetRepository.findById(tweetId)

            if (!validTweetId){
                return res.status(400).json({
                    ok: false,
                    message: "Tweet not found"
                });
            }
            
            const deletedTweet = await tweetRepository.delete(tweetId);

            res.status(200).send({
                ok: true,
                message: "Tweet deleted successfully:",
                data: deletedTweet
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
