import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../database/user.repository';
import { TweetRepository } from '../database/tweet.repository';
import { handleError } from './error.handler';
import { prisma } from './prisma.config';
import { JwtService } from '../services/jwt.service';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'Authentication token is required'
      });
    }

    // Validate token
    const payload = new JwtService().validateToken(token);

    if (!payload) {
      return res.status(401).json({
        ok: false,
        message: 'Invalid or expired token'
      });
    }

    // Extract user ID from payload
    const userId = payload.id;
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
    return handleError(error);
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
    if (!req.body) {
      req.body = {};
    }

    const userId = req.params.userId || req.body.userId;
    const tweetId = req.params.tweetId || req.body.tweetId;

    if (!userId || userId.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'User ID is required'
      });
    }

    if (!tweetId || tweetId.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Tweet ID is required'
      });
    }

    req.body.userId = userId;
    req.body.tweetId = tweetId;

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

export const validateOwnership = (resourceType: 'user' | 'tweet' | 'like') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = (req as any).user;
      let resourceOwnerId: string;

      switch (resourceType) {
        case 'user':
          if (!req.params.id || req.params.id.trim().length === 0 || req.params.id === 'undefined' || req.params.id === 'null') {
            return res.status(400).json({
              ok: false,
              message: 'User ID is required'
            });
          }
          resourceOwnerId = req.params.id;
          break;
        
        case 'tweet':
          if (req.params.id) {
            // For updating/deleting existing tweet
            const tweet = await prisma.tweet.findUnique({
              where: { id: req.params.id },
              select: { userId: true }
            });
            if (!tweet) {
              return res.status(404).json({
                ok: false,
                message: 'Tweet not found'
              });
            }
            resourceOwnerId = tweet.userId;
          } else {
            // For creating new tweet
            resourceOwnerId = req.body.userId;
          }
          break;
        
        case 'like':
          if (req.params.id) {
            // For deleting like by like ID
            const like = await prisma.like.findUnique({
              where: { id: req.params.id },
              select: { userId: true }
            });
            if (!like) {
              return res.status(404).json({
                ok: false,
                message: 'Like not found'
              });
            }
            resourceOwnerId = like.userId;
          } else {
            // For creating like
            resourceOwnerId = req.params.userId || req.body.userId;
          }
          break;
        
        default:
          return res.status(400).json({
            ok: false,
            message: 'Invalid resource type'
          });
      }

      // Verify if the authenticated user is the owner of the resource
      if (authenticatedUser.id !== resourceOwnerId) {
        return res.status(403).json({
          ok: false,
          message: 'You are not authorized to perform this action'
        });
      }

      next();
    } catch (error: any) {
      return handleError(error);
    }
  };
};

export const validateFollowOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authenticatedUser = (req as any).user;
    const { followerId } = req.body;

    // Verify if the authenticated user is the one trying to follow
    if (authenticatedUser.id !== followerId) {
      return res.status(403).json({
        ok: false,
        message: 'You can only perform follow actions for your own account'
      });
    }

    next();
  } catch (error: any) {
    return handleError(error);
  }
};