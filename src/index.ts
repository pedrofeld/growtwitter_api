import { UserRepository } from "./database/user.repository";
import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';
import { prisma } from "./config/prisma.config";
import * as bcrypt from 'bcrypt';
import { TweetRepository } from "./database/tweet.repository";
import { handleError } from "./config/error.handler";

dotenv.config();

// VIA EXPRESS SERVER

const app = express();
app.use(express.json());
app.use(cors());

// USERS

const userRepository = new UserRepository();
const tweetRepository = new TweetRepository();

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
        if (!req.body.name || !req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({
                ok: false,
                message: "Name, username, email and password are required fields"
            });
        }

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

// 6 - User login
app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        if (!login || !password) {
            return res.status(400).send({
                ok: false,
                message: "Login and password are required"
            });
        }

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

        const token = `token-${user.id}-${Date.now()}`;

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

// 7 - Get all tweets
app.get('/tweets', async (req, res) => {
    try {
        const tweets = await tweetRepository.findAll()
        res.status(200).send({
            ok: true,
            message: "All tweets:",
            data: tweets
        });
    } catch (error: any) {
        res.status(500).send({
            ok: false,
            message: "Error fetching tweets",
            error: error.message
        })
    }
})

// 8 - Create a tweet
app.post('/tweet', async (req, res) => {
    try {
        const tweetData = req.body;

        if (!tweetData.content || !tweetData.userId){
            return res.status(400).json({
                ok: false,
                message: "Content and userId are required fields"
            });
        }

        if (tweetData.userId){
            const validUserId = await userRepository.findById(tweetData.userId)

            if (!validUserId){
                return res.status(400).json({
                    ok: false,
                    message: "User not found"
                });
            }
        }

        const newTweet = await tweetRepository.createTweet(tweetData);

        res.status(201).send({
            ok: true,
            message: "Tweet created successfully:",
            data: newTweet
        });
    } catch (error: any) {
        res.status(500).send({
            ok: false,
            message: "Error creating tweet",
            error: error.message
        })
    }
})

// 9 - Update a tweet
app.put('/tweet/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tweetData = req.body;

        if (!id){
            return res.status(400).json({
                ok: false,
                message: "No ID added"
            })
        } else {
            const validTweetId = await tweetRepository.findById(id)

            if (!validTweetId){
                return res.status(400).json({
                    ok: false,
                    message: "Tweet not found"
                });
            }
        }

        if (!tweetData.content){
            return res.status(400).json({
                ok: false,
                message: "No content added"
            });
        }

        const updatedTweet = await tweetRepository.update(id, tweetData);

        res.status(200).send({
            ok: true,
            message: "Tweet updated successfully:",
            data: updatedTweet
        });
    } catch (error: any) {
        res.status(500).send({
            ok: false,
            message: "Error updating user",
            error: error.message
        });
    }
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// VIA BACK-END CODE (TESTING PURPOSES)

// const userRepository = new UserRepository();
// const tweetRepository = new TweetRepository();

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

//    // 6 - Get all tweets
//    const tweets = await tweetRepository.findAll();
//    console.log("All tweets:", tweets);

//     // 7 - Create a new tweet
//     const newTweet = await tweetRepository.createTweet({
//         content: "Thorweet! I am the God of Thunder!",
//         userId: "4011ccff-fb66-43c4-b563-d3eca46d7edb"
//     });
//     console.log("Created Tweet:", newTweet);

//     // 8 - Reply to a tweet
//     const replyTweet = await tweetRepository.createTweet({
//         content: "Where are Mjolnir and Stormbreaker?",
//         userId: "c1a19af2-8954-42a1-8a20-46a8c3662669",
//         parentId: "9e0ef305-4b39-4585-b1c7-3e34e8c48de5" // ID of the original tweet
//     });
//     console.log("Reply Tweet:", replyTweet);

//     // 9 - Update a tweet
//     const updatedTweet = await tweetRepository.update("03adae10-def7-4f8e-9e5c-55f5e6f6c1ca", {
//         content: "Where are Mjolnir and Stormbreaker, Thor?"
//     });
//     console.log("Updated Tweet:", updatedTweet);

//     // 10 - Delete a tweet
//     const deletedTweet = await tweetRepository.delete("03adae10-def7-4f8e-9e5c-55f5e6f6c1ca");
//     console.log("Deleted Tweet:", deletedTweet);

//     // 11 - Like a tweet
//     const like = await tweetRepository.likeTweet({
//         tweetId: "9e0ef305-4b39-4585-b1c7-3e34e8c48de5",
//         userId: "c1a19af2-8954-42a1-8a20-46a8c3662669"
//     });
//     console.log("Liked Tweet:", like);

//     // 12 - Unlike a tweet
//     const unlike = await tweetRepository.unlikeTweet({
//         tweetId: "9e0ef305-4b39-4585-b1c7-3e34e8c48de5",
//         userId: "c1a19af2-8954-42a1-8a20-46a8c3662669"
//     });
//     console.log("Unliked Tweet:", unlike);
//}

// main();