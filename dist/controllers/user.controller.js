"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const auth_service_1 = require("../services/auth.service");
class UserController {
    service = new user_service_1.UserService();
    authService = new auth_service_1.AuthService();
    // 1 - Get all users (non-mandatory method)
    async getAll(req, res) {
        try {
            const users = await this.service.getAll();
            res.status(200).json({
                ok: true,
                data: users
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error fetching users",
                error: error.message
            });
        }
    }
    // 2 - Get user by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    message: "ID is required"
                });
            }
            const user = await this.service.getById(id);
            res.status(200).json({
                ok: true,
                message: "User found",
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error fetching user",
                error: error.message
            });
        }
    }
    // 3 - Create new user
    async create(req, res) {
        try {
            const user = await this.service.create(req.body);
            res.status(201).json({
                ok: true,
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error creating user",
                error: error.message
            });
        }
    }
    // 4 - Update user
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    message: "ID is required"
                });
            }
            const user = await this.service.update(id, req.body);
            res.status(200).json({
                ok: true,
                message: "User updated",
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error updating user",
                error: error.message
            });
        }
    }
    // 5 - Delete user
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    ok: false,
                    message: "ID is required"
                });
            }
            const user = await this.service.delete(id);
            res.status(200).json({
                ok: true,
                message: "User deleted",
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                ok: false,
                message: "Error deleting user",
                error: error.message
            });
        }
    }
}
exports.UserController = UserController;
// OLD METHOD (NOT RECOMMENDED)
/*
    // Alerts:
    // - The following code is an older approach where the controller directly interacts with the repository layer.
    // - It is recommended to use the service layer (as shown above) for better separation of concerns and maintainability.

    import { UserRepository } from "../database/user.repository";
    import { prisma } from "../config/prisma.config";
    import * as bcrypt from 'bcrypt';
    import {
    authMiddleware,
    validateUserCreation,
    validateIdParam,
    validateUserLogin,
    validateOwnership,
    } from "../config/middlewares";
    import { JwtService } from "../services/jwt.service";
    import app from "../app";

    const userRepository = new UserRepository();

    // 1 - Get all users (non-mandatory method)
    app.get('/users', async (req, res) => {
        try {
            const users = await userRepository.findAll();
            res.status(200).send({
                ok: true,
                message: "All users:",
                data: users
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error fetching users",
                error: error.message
            })
        }
    });

    // 2 - Get user by ID
    app.get('/user/:id', authMiddleware, validateIdParam, async (req, res) => {
        try {
            const { id } = req.params;
            const userId = id as string;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    tweets: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({
                    ok: false,
                    message: "User not found"
                });
            }

            const followers = await prisma.follow.findMany({
                where: {
                    followingId: userId
                },
                include: {
                    follower: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            });

            const following = await prisma.follow.findMany({
                where: {
                    followerId: userId
                },
                include: {
                    following: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            profileImage: true
                        }
                    }
                }
            });

            const response = {
                ok: true,
                message: "User found:",
                data: {
                    ...user,
                    followers: followers,
                    following: following
                }
            };

            res.status(200).json(response);

        } catch (error: any) {
            res.status(500).json({
                ok: false,
                message: "Error fetching user",
                error: error.message
            });
        }
    });

    // 3 - Create a new user
    app.post('/user', validateUserCreation, async (req, res) => {
        try {
            const userData = req.body;
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const newUser = await userRepository.create({ ...userData, password: hashedPassword });

            if (!newUser) {
                throw new Error("Failed to create user");
            }

            const userWithoutPassword = {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            };

            res.status(201).send({
                ok: true,
                message: "User created successfully:",
                data: userWithoutPassword
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error creating user",
                error: error.message
            });
        }
    });

    // 4 - Update an existing user (non-mandatory method)
    app.put('/user/:id', authMiddleware, validateIdParam, validateOwnership('user'), async (req, res) => {
        try {
            const { id } = req.params;
            const userId = id as string;
            const userData = req.body;
            const updatedUser = await userRepository.update(userId, userData);

            if (updatedUser) {
                res.status(200).send({
                    ok: true,
                    message: "User updated successfully:",
                    data: updatedUser
                });
            } else {
                res.status(404).send({
                    ok: false,
                    message: "User not found"
                });
            }
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error updating user",
                error: error.message
            });
        }
    });

    // 5 - Delete a user (non-mandatory method)
    app.delete('/user/:id', authMiddleware, validateIdParam, validateOwnership('user'), async (req, res) => {
        try {
            const { id } = req.params;
            const userId = id as string;
            const deletedUser = await userRepository.delete(userId);

            if (deletedUser) {
                res.status(200).send({
                    ok: true,
                    message: "User deleted successfully:",
                    data: deletedUser
                });
            } else {
                res.status(404).send({
                    ok: false,
                    message: "User not found"
                });
            }
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error deleting user",
                error: error.message
            });
        }
    });

    // 6 - User login
    app.post('/login', validateUserLogin, async (req, res) => {
        try {
            const { login, password } = req.body;
            let user = await userRepository.findByEmail(login);

            if (!user) {
                user = await userRepository.findByUsername(login);
            }

            if (!user) {
                return res.status(404).send({
                    ok: false,
                    message: "Invalid login credentials"
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).send({
                    ok: false,
                    message: "Invalid password"
                });
            }

            const token = new JwtService().createToken({
                id: user.id,
                username: user.username
            });

            res.status(200).send({
                ok: true,
                message: "Login successful",
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    },
                    token
                }
            });
        } catch (error: any) {
            res.status(500).send({
                ok: false,
                message: "Error logging in: " + error.message
            });
        }
    });
*/ 
