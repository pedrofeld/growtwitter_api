import { TweetRepository } from "../database/tweet.repository";

export class FeedService {
  private repo = new TweetRepository();

  // 1 - Get user feed
  async getFeed(userId: string) {
    if (!userId) {
      throw new Error("User ID is required to fetch feed");
    }
    return this.repo.findFeed(userId);
  }
}