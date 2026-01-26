import { UserRepository } from "../database/user.repository";
import { TweetRepository } from "../database/tweet.repository";
import { LikeRepository } from "../database/like.repository";
import { handleError } from "../config/error.handler";
import { LikeDto } from "../dtos/create-like.dto";

export class LikeService {
  private userRepo = new UserRepository();
  private tweetRepo = new TweetRepository();
  private likeRepo = new LikeRepository();

  // 1 - Like a tweet
  async likeTweet(data: LikeDto) {
    try {
      if (!data.userId || !data.tweetId) {
        throw new Error("User ID and Tweet ID are required");
      }
      const userExists = await this.userRepo.findById(data.userId);
      if (!userExists) {
        throw new Error("User not found");
      }
      const tweetExists = await this.tweetRepo.findById(data.tweetId);
      if (!tweetExists) {
        throw new Error("Tweet not found");
      }
      const like = await this.likeRepo.likeTweet({
        userId: data.userId,
        tweetId: data.tweetId,
      });
      if (!like) {
        throw new Error("You already liked this tweet");
      }
      return like;
    } catch (error: any) {
      return handleError(error);
    }
  }

  // 2 - Unlike a tweet
  async unlikeTweet(likeId: string) {
    try {
      if (!likeId) {
        throw new Error("Like ID is required");
      }
      const likeExists = await this.likeRepo.findById(likeId);
      if (!likeExists) {
        throw new Error("Like not found");
      }
      return this.likeRepo.unlikeTweet(likeId);
    } catch (error: any) {
      return handleError(error);
    }
  }
}