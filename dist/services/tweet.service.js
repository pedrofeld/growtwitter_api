"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetService = void 0;
const tweet_repository_1 = require("../database/tweet.repository");
const user_repository_1 = require("../database/user.repository");
class TweetService {
    tweetRepository = new tweet_repository_1.TweetRepository();
    userRepository = new user_repository_1.UserRepository();
    // 1 - Get all tweets (non-mandatory method)
    async getAllTweets() {
        return this.tweetRepository.findAll();
    }
    // 2 - Create a tweet
    async createTweet(tweetData) {
        if (!tweetData.content) {
            throw new Error("No content added");
        }
        const userExists = await this.userRepository.findById(tweetData.userId);
        if (!userExists) {
            throw new Error("User not found");
        }
        return this.tweetRepository.createTweet(tweetData);
    }
    // 3 - Update a tweet (non-mandatory method)
    async updateTweet(tweetId, tweetData) {
        if (!tweetId) {
            throw new Error("Tweet ID is required");
        }
        if (!tweetData.content) {
            throw new Error("No content added");
        }
        const tweetExists = await this.tweetRepository.findById(tweetId);
        if (!tweetExists) {
            throw new Error("Tweet not found");
        }
        return this.tweetRepository.update(tweetId, tweetData);
    }
    // 4 - Delete a tweet (non-mandatory method)
    async deleteTweet(tweetId) {
        if (!tweetId) {
            throw new Error("Tweet ID is required");
        }
        const tweetExists = await this.tweetRepository.findById(tweetId);
        if (!tweetExists) {
            throw new Error("Tweet not found");
        }
        return this.tweetRepository.delete(tweetId);
    }
}
exports.TweetService = TweetService;
