import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';
import userRoutes from "./routes/user.routes";
import tweetRoutes from './routes/tweet.routes';
import likeRoutes from './routes/like.routes';
import followRoutes from './routes/follow.routes';
import feedRoutes from './routes/feed.routes';
import authRoutes from './routes/auth.routes';

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

app.use(
    userRoutes,
    tweetRoutes,
    likeRoutes,
    followRoutes,
    feedRoutes,
    authRoutes
);

export default app;