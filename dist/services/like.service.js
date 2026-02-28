"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const user_repository_1 = require("../database/user.repository");
const tweet_repository_1 = require("../database/tweet.repository");
const like_repository_1 = require("../database/like.repository");
const error_handler_1 = require("../config/error.handler");
class LikeService {
    userRepo = new user_repository_1.UserRepository();
    tweetRepo = new tweet_repository_1.TweetRepository();
    likeRepo = new like_repository_1.LikeRepository();
    // 1 - Like a tweet
    async likeTweet(data) {
        try {
            if (!data.userId || !data.tweetId) {
                throw new Error("User ID and Tweet ID are required");
            }
            const userExists = await this.userRepo.findById(data.userId);
            if (!userExists) {
                throw new Error("User not found");
            }
            const tweetExists = await this.tweetRepo.findById(data.tweetId);
            if (!tweetExists) {
                throw new Error("Tweet not found");
            }
            const like = await this.likeRepo.likeTweet({
                userId: data.userId,
                tweetId: data.tweetId,
            });
            if (!like) {
                throw new Error("You already liked this tweet");
            }
            return like;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    // 2 - Unlike a tweet
    async unlikeTweet(likeId) {
        try {
            if (!likeId) {
                throw new Error("Like ID is required");
            }
            const likeExists = await this.likeRepo.findById(likeId);
            if (!likeExists) {
                throw new Error("Like not found");
            }
            return this.likeRepo.unlikeTweet(likeId);
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
}
exports.LikeService = LikeService;
