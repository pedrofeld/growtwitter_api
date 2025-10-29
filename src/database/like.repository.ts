import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";
import { LikeDto } from "../dtos/create-like.dto";

export class LikeRepository{
    public async findById(id: string){
        try {
            if (!id) {
                throw new Error("No ID added");
            }

            const like = await prisma.like.findUnique({
                where: { id },
            });

            if (!like){
                throw new Error("Like not found")
            }

            return like;
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
                throw new Error("You already liked this tweet");
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

    public async unlikeTweet(id: string) {
        try {
            if (!id) {
                throw new Error("Like not found");
            }

            const like = await prisma.like.delete({
                where: {
                    id
                }
            });

            return like;
        } catch (error: any) {
            return handleError(error);
        }
    }
}