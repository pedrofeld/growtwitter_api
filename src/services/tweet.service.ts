import { TweetRepository } from "../database/tweet.repository";
import { UserRepository } from "../database/user.repository";
import { CreateTweetDto } from "../dtos/create-tweet.dto";
import { UpdateTweetDto } from "../dtos/update-tweet.dto";

export class TweetService {
  private tweetRepository = new TweetRepository();
  private userRepository = new UserRepository();

  // 1 - Get all tweets (non-mandatory method)
  async getAllTweets() {
    return this.tweetRepository.findAll();
  }

  // 2 - Create a tweet
  async createTweet(tweetData: CreateTweetDto) {
    if (!tweetData.content) {
      throw new Error("No content added");
    }
    const userExists = await this.userRepository.findById(tweetData.userId);
    if (!userExists) {
      throw new Error("User not found");
    }
    return this.tweetRepository.createTweet(tweetData);
  }

  // 3 - Update a tweet (non-mandatory method)
  async updateTweet(tweetId: string, tweetData: UpdateTweetDto) {
    if (!tweetId) {
      throw new Error("Tweet ID is required");
    }
    if (!tweetData.content) {
      throw new Error("No content added");
    }
    const tweetExists = await this.tweetRepository.findById(tweetId);
    if (!tweetExists) {
      throw new Error("Tweet not found");
    }
    return this.tweetRepository.update(tweetId, tweetData);
  }

  // 4 - Delete a tweet (non-mandatory method)
  async deleteTweet(tweetId: string) {
    if (!tweetId) {
      throw new Error("Tweet ID is required");
    }
    const tweetExists = await this.tweetRepository.findById(tweetId);
    if (!tweetExists) {
      throw new Error("Tweet not found");
    }
    return this.tweetRepository.delete(tweetId);
  }
}