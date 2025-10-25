import { UserRepository } from "./database/user.repository";
import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';
import { prisma } from "./config/prisma.config";

dotenv.config();

// VIA EXPRESS SERVER

const app = express();
app.use(express.json());
app.use(cors());

// USERS

const userRepository = new UserRepository();

// 1 - Get all users
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

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id },
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
                followingId: id
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
                followerId: id  
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
app.post('/user', async (req, res) => {
    const userData = req.body;
    try {
        const newUser = await userRepository.create(userData);
        res.status(201).send({
            ok: true,
            message: "User created successfully:",
            data: newUser
        });
    } catch (error: any) {
        res.status(500).send({
            ok: false,
            message: "Error creating user",
            error: error.message
        });
    }
});

// 4 - Update an existing user
app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const userData = req.body;
    try {
        const updatedUser = await userRepository.update(id, userData);
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

// 5 - Delete a user
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await userRepository.delete(id);
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// VIA BACK-END CODE (TESTING PURPOSES)

// const userRepository = new UserRepository();

// async function main() {
//     // 1 - Get all users
//     const users = await userRepository.findAll();
//     console.log("All users:", users);

//     // 2 - Get user by ID
//     const user = await userRepository.findById("74195d6f-32be-4428-b255-d385ff73b6dc");
//     console.log("User by ID:", user);

//     // 3 - Create a new user
//     const newUser = await userRepository.create({
//         name: "Thor",
//         username: "thor.odinson",
//         email: "god.of.thunder@gmail.com",
//         password: "12345",
//     });
//     console.log("Created User:", newUser);

//     // 4 - Update an existing user
//     const updatedUser = await userRepository.update("daec2955-097f-4c58-be92-3986611eb84a", {
//         name: "Thor Odinson",
//         username: "gof.of.thunder",
//     });
//     console.log("Updated User:", updatedUser);

//     // 5 - Delete a user
//     const deletedUser = await userRepository.delete("daec2955-097f-4c58-be92-3986611eb84a");
//     console.log("Deleted User:", deletedUser);
// }

// main();