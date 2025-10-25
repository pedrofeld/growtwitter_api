import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";
import { FollowUserDto } from "../dtos/create-follow.dto";

export class FollowRepository {
    // Follow a user
    public async followUser(data: FollowUserDto) {
        try {
            // User cannot follow themselves
            if (data.followerId === data.followingId) {
                throw new Error("User cannot follow themselves");
            }

            // Check if the user to be followed exists
            const userToFollow = await prisma.user.findUnique({
                where: { id: data.followingId }
            });

            if (!userToFollow) {
                throw new Error("User not found");
            }

            // Check if already following (prevent duplicate follow)
            const existingFollow = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: data.followerId,
                        followingId: data.followingId
                    }
                }
            });

            if (existingFollow) {
                throw new Error("You are already following this user");
            }

            // Create the follow
            const follow = await prisma.follow.create({
                data: {
                    followerId: data.followerId,
                    followingId: data.followingId
                }
            });

            return follow;
        } catch (error: any) {
            throw new Error(`Error following user: ${error.message}`);
        }
    }

    // Unfollow a user
    public async unfollowUser(data: FollowUserDto) {
        try {
            const follow = await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: data.followerId,
                        followingId: data.followingId
                    }
                }
            });

            return follow;
        } catch (error: any) {
            throw new Error(`Error unfollowing user: ${error.message}`);
        }
    }
}