import { UserRepository } from "./database/user.repository";
import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';

dotenv.config();

// VIA EXPRESS SERVER

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const userRepository = new UserRepository();

// VIA BACK-END CODE (TESTING PURPOSES)

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
//         username: "playboyzinho",
//         email: "deus.do.trovao@gmail.com",
//         password: "12345",
//     });
//     console.log("Created User:", newUser);

//     // 4 - Update an existing user
//     const updatedUser = await userRepository.update("daec2955-097f-4c58-be92-3986611eb84a", {
//         name: "Thor Odinson",
//         username: "deus.trovao",
//     });
//     console.log("Updated User:", updatedUser);

//     // 5 - Delete a user
//     const deletedUser = await userRepository.delete("daec2955-097f-4c58-be92-3986611eb84a");
//     console.log("Deleted User:", deletedUser);
// }

// main();