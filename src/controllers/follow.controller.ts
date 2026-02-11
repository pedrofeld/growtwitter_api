import { Request, Response } from "express";
import { FollowService } from "../services/follow.service";

const followService = new FollowService();

export class FollowController {
    // 1 - Get all follows (non-mandatory method)
    async getAll(req: Request, res: Response) {
        try {
            const follows = await followService.getAllFollows();
            res.status(200).json({
                ok: true,
                message: "All follows:",
                data: follows,
            });
        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: "Error fetching follows",
                error: error.message,
            });
        }
    }

    // 2 - Follow a user
    async follow(req: Request, res: Response) {
        try {
            const data = req.body;
            const follow = await followService.followUser(data);
            res.status(200).json({
                ok: true,
                message: "User followed successfully",
                data: follow,
            });
        } catch (error: any) {
            res.status(400).json({
                ok: false,
                message: "Error following user",
                error: error.message,
            });
        }
    }

    // 3 - Unfollow a user
    async unfollow(req: Request, res: Response) {
        try {
            const data = req.body;
            const unfollow = await followService.unfollowUser(data);
            res.status(200).json({
                ok: true,
                message: "User unfollowed successfully",
                data: unfollow,
            });
        } catch (error: any) {
            res.status(400).json({
                ok: false,
                message: "Error unfollowing user",
                error: error.message,
            });
        }
    }
}

// OLD METHOD (NOT RECOMMENDED)
/*
    import { UserRepository } from "../database/user.repository";
    import { FollowRepository } from "../database/follow.repository";
    import { 
    authMiddleware, 
    validateFollow,
    validateFollowOwnership
    } from "../config/middlewares";
    import app from "../app";

    const userRepository = new UserRepository();
    const followRepository = new FollowRepository();

    // 1 - Get all follows (non-mandatory method)
    app.get('/follows', async (req, res) => {
        try {
            const follows = await followRepository.findAll()
            res.status(200).send({
                ok: true,
                message: "All follows:",
                data: follows
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error fetching follows",
                error: error.message
            })
        }
    })

    // 2 - Follow a user
    app.post('/follow', authMiddleware, validateFollow, validateFollowOwnership, async (req, res) => {
        try {
            const { followerId, followingId } = req.body;
            const followData = { followerId, followingId }
            const validFollowerId = await userRepository.findById(followerId)

            if (!validFollowerId){
                return res.status(400).json({
                    ok: false,
                    message: "User not found"
                });
            }

            const validFollowingId = await userRepository.findById(followingId)

            if (!validFollowingId){
                return res.status(400).json({
                    ok: false,
                    message: "User not found"
                });
            }
        
            if (followerId === followingId){
                return res.status(400).json({
                    ok: false,
                    message: "User cannot follow themselves"
                })
            }

            const newFollow = await followRepository.followUser(followData)

            if (!newFollow){
                return res.status(400).json({
                    ok: false,
                    message: "You already follow this user"
                });
            }

            res.status(200).send({
                ok: true,
                message: "User followed successfully:",
                data: newFollow
            });

        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error following user",
                error: error.message
            });
        }
    })

    // 3 - Unfollow a user
    app.delete('/unfollow', authMiddleware, validateFollowOwnership, async (req, res) => {
        try {
            const { followerId, followingId } = req.body;
            const followData = { followerId, followingId }
            const validFollowerId = await userRepository.findById(followerId)

            if (!validFollowerId){
                return res.status(400).json({
                    ok: false,
                    message: "User not found"
                });
            }

            const validFollowingId = await userRepository.findById(followingId)

            if (!validFollowingId){
                return res.status(400).json({
                    ok: false,
                    message: "User not found"
                });
            }
        
            if (followerId === followingId){
                return res.status(400).json({
                    ok: false,
                    message: "User cannot unfollow themselves"
                })
            }

            const deletedFollow = await followRepository.unfollowUser(followData)

            if (!deletedFollow){
                return res.status(400).json({
                    ok: false,
                    message: "You already unfollow this user"
                });
            }

            res.status(200).send({
                ok: true,
                message: "User unfollowed successfully:",
                data: deletedFollow
            });

        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error unfollowing user",
                error: error.message
            });
        }
    })
*/