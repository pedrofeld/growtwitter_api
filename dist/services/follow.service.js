"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const user_repository_1 = require("../database/user.repository");
const follow_repository_1 = require("../database/follow.repository");
const error_handler_1 = require("../config/error.handler");
class FollowService {
    userRepo = new user_repository_1.UserRepository();
    followRepo = new follow_repository_1.FollowRepository();
    // 1 - Get all follows (non-mandatory method)
    async getAllFollows() {
        return this.followRepo.findAll();
    }
    // 2 - Follow a user
    async followUser(data) {
        try {
            const { followerId, followingId } = data;
            if (!followerId || !followingId) {
                throw new Error("FollowerId and FollowingId are required");
            }
            if (followerId === followingId) {
                throw new Error("User cannot follow themselves");
            }
            const followerExists = await this.userRepo.findById(followerId);
            if (!followerExists) {
                throw new Error("User not found");
            }
            const followingExists = await this.userRepo.findById(followingId);
            if (!followingExists) {
                throw new Error("User not found");
            }
            const follow = await this.followRepo.followUser({ followerId, followingId });
            if (!follow) {
                throw new Error("You already follow this user");
            }
            return follow;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    // 3 - Unfollow a user
    async unfollowUser(data) {
        try {
            const { followerId, followingId } = data;
            if (!followerId || !followingId) {
                throw new Error("FollowerId and FollowingId are required");
            }
            if (followerId === followingId) {
                throw new Error("User cannot unfollow themselves");
            }
            const followerExists = await this.userRepo.findById(followerId);
            if (!followerExists) {
                throw new Error("User not found");
            }
            const followingExists = await this.userRepo.findById(followingId);
            if (!followingExists) {
                throw new Error("User not found");
            }
            const unfollow = await this.followRepo.unfollowUser({ followerId, followingId });
            if (!unfollow) {
                throw new Error("You do not follow this user");
            }
            return unfollow;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
}
exports.FollowService = FollowService;
