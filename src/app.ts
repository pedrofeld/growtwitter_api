import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';
import userRoutes from "./routes/user.routes";

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

app.use(userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;