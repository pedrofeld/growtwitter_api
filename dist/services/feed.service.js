"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const tweet_repository_1 = require("../database/tweet.repository");
class FeedService {
    repo = new tweet_repository_1.TweetRepository();
    // 1 - Get user feed
    async getFeed(userId) {
        if (!userId) {
            throw new Error("User ID is required to fetch feed");
        }
        return this.repo.findFeed(userId);
    }
}
exports.FeedService = FeedService;
