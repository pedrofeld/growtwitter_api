"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetRepository = void 0;
const error_handler_1 = require("../config/error.handler");
const prisma_config_1 = require("../config/prisma.config");
class TweetRepository {
    async findAll(maxDepth = 50) {
        try {
            const includeRepliesRecursive = (currentDepth) => {
                const baseInclude = {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            replies: true
                        }
                    },
                    likes: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                };
                // Limit response levels so as not to overload the prism
                if (currentDepth >= maxDepth) {
                    return baseInclude;
                }
                return {
                    ...baseInclude,
                    replies: {
                        include: includeRepliesRecursive(currentDepth + 1), // Recursion
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                };
            };
            const tweets = await prisma_config_1.prisma.tweet.findMany({
                where: {
                    parentId: null // Just original tweets
                },
                include: includeRepliesRecursive(0),
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return tweets;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    async findById(id) {
        try {
            const tweet = await prisma_config_1.prisma.tweet.findUnique({
                where: { id },
            });
            return tweet;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    async createTweet(data) {
        try {
            // Check it it is a reply
            if (data.parentId) {
                const parentTweet = await prisma_config_1.prisma.tweet.findUnique({
                    where: { id: data.parentId }
                });
                if (!parentTweet) {
                    throw new Error("Tweet original não encontrado");
                }
            }
            const tweetData = {
                content: data.content,
                userId: data.userId,
                parentId: data.parentId || null // If has parentId = reply, else = original tweet
            };
            const tweet = await prisma_config_1.prisma.tweet.create({
                data: tweetData,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            });
            return tweet;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    async update(id, data) {
        try {
            const updatedTweet = await prisma_config_1.prisma.tweet.update({
                where: { id },
                data,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    },
                    likes: true,
                    replies: true
                }
            });
            return updatedTweet;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    async delete(id) {
        try {
            const deletedTweet = await prisma_config_1.prisma.tweet.delete({
                where: { id }
            });
            return deletedTweet;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
    async findFeed(userId, maxDepth = 50) {
        try {
            const following = await prisma_config_1.prisma.follow.findMany({
                where: { followerId: userId },
                select: { followingId: true }
            });
            const followingIds = following.map(follow => follow.followingId);
            const userIds = [userId, ...followingIds];
            const includeRepliesRecursive = (currentDepth) => {
                const baseInclude = {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            replies: true
                        }
                    },
                    likes: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true
                                }
                            }
                        }
                    }
                };
                if (currentDepth >= maxDepth) {
                    return baseInclude;
                }
                return {
                    ...baseInclude,
                    replies: {
                        include: includeRepliesRecursive(currentDepth + 1),
                        orderBy: {
                            createdAt: 'asc'
                        }
                    }
                };
            };
            const tweets = await prisma_config_1.prisma.tweet.findMany({
                where: {
                    parentId: null,
                    userId: { in: userIds } // Filter by followed users and self
                },
                include: includeRepliesRecursive(0),
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return tweets;
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
}
exports.TweetRepository = TweetRepository;
