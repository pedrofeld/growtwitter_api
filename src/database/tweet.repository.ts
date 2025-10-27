import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";
import { CreateTweetDto } from "../dtos/create-tweet.dto";
import { UpdateTweetDto } from "../dtos/update-tweet.dto";
import { LikeDto } from "../dtos/create-like.dto";

export class TweetRepository {
    public async findAll() {
        try {
            const tweets = await prisma.tweet.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            username: true
                        }
                    },
                    likes: true,
                    replies: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return tweets;
        } catch (error: any) {
            return handleError(error);
        }
    }

    public async createTweet(data: CreateTweetDto) {
        try {
            // Check it it is a reply
            if (data.parentId) {
                const parentTweet = await prisma.tweet.findUnique({
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

            const tweet = await prisma.tweet.create({
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
        } catch (error: any) {
            return handleError(error);
        }
    }

    public async update(id: string, data: UpdateTweetDto) {
        try {
            const updatedTweet = await prisma.tweet.update({
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
        } catch (error: any) {
            return handleError(error);
        }
    }

    public async delete(id: string) {
        try {
            const deletedTweet = await prisma.tweet.delete({
                where: { id }
            });
            return deletedTweet;
        } catch (error: any) {
            return handleError(error);
        }
    }

    public async likeTweet(data: LikeDto) {
        try {
            // Check if tweet exists
            const tweet = await prisma.tweet.findUnique({
                where: { id: data.tweetId }
            });

            if (!tweet) {
                throw new Error("Tweet não encontrado");
            }

            // Check if user already liked the tweet (prevent duplicate like)
            const existingLike = await prisma.like.findUnique({
                where: {
                    userId_tweetId: {
                        userId: data.userId,
                        tweetId: data.tweetId
                    }
                }
            });

            if (existingLike) {
                throw new Error("Você já curtiu este tweet");
            }

            // Create the like
            const like = await prisma.like.create({
                data: {
                    userId: data.userId,
                    tweetId: data.tweetId
                }
            });

            return like;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // Unlike a tweet
    public async unlikeTweet(data: LikeDto) {
        try {
            if (!data.tweetId) {
                throw new Error("Tweet not found");
            }

            if (!data.userId) {
                throw new Error("User not found");
            }

            const like = await prisma.like.delete({
                where: {
                    userId_tweetId: {
                        userId: data.userId,
                        tweetId: data.tweetId
                    }
                }
            });

            return like;
        } catch (error: any) {
            return handleError(error);
        }
    }
}