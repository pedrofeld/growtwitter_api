import { UserRepository } from "../database/user.repository";
import { FollowRepository } from "../database/follow.repository";
import { handleError } from "../config/error.handler";
import { FollowUserDto } from "../dtos/create-follow.dto";

export class FollowService {
  private userRepo = new UserRepository();
  private followRepo = new FollowRepository();

  // 1 - Get all follows (non-mandatory method)
  async getAllFollows() {
    return this.followRepo.findAll();
  }

  // 2 - Follow a user
  async followUser(data: FollowUserDto) {
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
      const follow = await this.followRepo.followUser({followerId, followingId});
      if (!follow) {
        throw new Error("You already follow this user");
      }
      return follow;
    } catch (error: any) {
      return handleError(error);
    }
  }

  // 3 - Unfollow a user
  async unfollowUser(data: FollowUserDto) {
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
      const unfollow = await this.followRepo.unfollowUser({followerId, followingId});
      if (!unfollow) {
        throw new Error("You do not follow this user");
      }
      return unfollow;
    } catch (error: any) {
      return handleError(error);
    }
  }
}