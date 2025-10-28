import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";
import { LikeDto } from "../dtos/create-like.dto";

export class LikeRepository{
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