import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../database/user.repository';
import { TweetRepository } from '../database/tweet.repository';
import { handleError } from './error.handler';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'Authentication token not provided'
      });
    }

    const tokenValue = token.replace('Bearer ', '');
    
    if (!tokenValue.startsWith('token-')) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid token'
      });
    }

    const tokenParts = tokenValue.split('-');
    
    if (tokenParts.length < 3 || !tokenParts[1]) {
      return res.status(401).json({
        ok: false,
        message: 'Malformed token'
      });
    }

    const userId = tokenParts[1];
    
    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'User not found'
      });
    }

    (req as any).user = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      ok: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

export const validateUserCreation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Name, username, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
  
};

export const validateTweetCreation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tweetData = req.body;

    if (!tweetData.userId){
      return res.status(400).json({
        ok: false,
        message: "userId is required"
      });
    }

    if (!tweetData.content || tweetData.content.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Content is required"
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
};

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id || id.trim().length === 0 || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        ok: false,
        message: 'ID is required'
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
};

export const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Login and password are required'
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
};

export const validateLike = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, tweetId } = req.body;

    if (!userId || !tweetId) {
      return res.status(400).json({
        ok: false,
        message: 'User ID and Tweet ID are required'
      });
    }

    const tweetData = { userId, tweetId };
    if (tweetData.userId === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'User ID is required'
      });
    }

    if (tweetData.tweetId === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'Tweet ID is required'
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
}

export const validateFollow = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId) {
      return res.status(400).json({
        ok: false,
        message: 'Follower ID is required'
      });
    }

    if (!followingId) {
      return res.status(400).json({
        ok: false,
        message: 'Following ID is required'
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
}