"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const user_routes_1 = require("./routes/user.routes");
const tweet_routes_1 = require("./routes/tweet.routes");
const like_routes_1 = require("./routes/like.routes");
const follow_routes_1 = require("./routes/follow.routes");
const feed_routes_1 = require("./routes/feed.routes");
const auth_routes_1 = require("./routes/auth.routes");
const app = express();
app.use(express.json());
app.use(cors());
/*
    It would be necessary to configure CORS to accept requests only from the front-end domain, because it is a browser restriction. It does not affect Postman or other API testing tools.
    Exemple:
    app.use(cors({
        origin: 'https://my-front-end.com'
    }));
*/
dotenv.config();
app.use(user_routes_1.default, tweet_routes_1.default, like_routes_1.default, follow_routes_1.default, feed_routes_1.default, auth_routes_1.default);
exports.default = app;
