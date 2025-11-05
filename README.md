# Growtwitter API

A complete RESTful API for a Twitter-like social network, developed as part of the Full Stack Web Development bootcamp at [Growdev](https://growdev.com.br/ "Official website of Growdev education institution"). This application allows users to share thoughts through tweets and interact through likes, replies, and follows.

## 🚀 Technologies Used

- **Node.js** - JavaScript runtime environment
- **TypeScript** - Typed JavaScript superset
- **Express.js** - Web framework for Node.js
- **PostgreSQL** - Relational database
- **Prisma ORM** - ORM for database access
- **bcrypt** - Password encryption
- **CORS** - Cross-origin requests enablement

## 📋 Implemented Features

### 👥 User Management
- ✅ New user registration
- ✅ Login with username/email and password
- ✅ Token-based authentication
- ✅ Profile updates
- ✅ Account deletion
- ✅ Search for all accounts or specific account

### 💬 Tweet System
- ✅ Creation of tweets and replies (responses to other tweets)
- ✅ Personalized feed
- ✅ Tweet editing and deletion
- ✅ Reply hierarchy with recursion

### ❤️ Interaction System
- ✅ Likes on tweets
- ✅ Follow/Unfollow between users
- ✅ Ownership validation (each user manages only their own resources)

## 🗂️ API Structure

### Models and Relationships

**User <-> Tweet**
- 1 User can post N Tweets (1:N)
- 1 Tweet belongs to 1 User (1:1)

**User <-> Like**
- 1 User can like N Tweets (1:N)
- 1 Like belongs to 1 User (1:1)

**Tweet <-> Like**
- 1 Tweet can have N Likes (1:N)
- 1 Like belongs to 1 Tweet (1:1)

**User <-> Follow**
- 1 User can follow N Users (self-referencing)
- Followers/following system

## 🔐 API Routes

### Authentication
- Via Authorization key in the method Headers

### Users
- `GET /users` - List all users
- `GET /user/:id` - Get specific user (with tweets and followers)
- `POST /user` - Create user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Tweets
- `GET /tweets` - List all tweets
- `POST /tweet` - Create tweet
- `PUT /tweet/:id` - Update tweet
- `DELETE /tweet/:id` - Delete tweet

### Feed and Interactions
- `GET /feed` - Personalized feed (your tweets + tweets from users you follow)
- `POST /like/:userId/:tweetId` - Like a tweet
- `DELETE /like/:id` - Remove like
- `GET /follows` - List follows
- `POST /follow` - Follow user
- `DELETE /unfollow` - Unfollow user

## 🛡️ Security

- **Authentication**: Token-based
- **Validation**: Middlewares for resource ownership verification
- **Security**: Password encryption with bcrypt
- **Data Validation**: Specific middlewares for each route
- **Error Handling**: Centralized exception handling system

## 🎯 Skills Practiced

- **REST API** - Endpoint design following REST principles
- **TypeScript** - Development with static typing
- **Prisma ORM** - Data modeling and optimized queries
- **Authentication** - Secure login and authorization system
- **Database** - Relational modeling with PostgreSQL
- **Architecture** - Separation of concerns (config, database, dtos...)
- **Validation** - Middlewares for data and permission validation
- **Recursion** - Implementation of hierarchical replies

## 👨‍💻 Author

Developed by [Pedro Feld](https://www.linkedin.com/in/pedro-feld/ "Author's LinkedIn profile").