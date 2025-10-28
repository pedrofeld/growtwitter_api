import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";
import { CreateTweetDto } from "../dtos/create-tweet.dto";
import { UpdateTweetDto } from "../dtos/update-tweet.dto";

export class TweetRepository {
    public async findAll(maxDepth: number = 50) {
        try {
            const includeRepliesRecursive = (currentDepth: number): any => {
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

            const tweets = await prisma.tweet.findMany({
                where: {
                    parentId: null // Just original tweets
                },
                include: includeRepliesRecursive(0),
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return tweets;
        } catch (error: any) {
            return handleError(error);
        }
    }

    public async findById(id: string) {
        try {
            const tweet = await prisma.tweet.findUnique({
                where: { id },
            });
            return tweet;
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
}