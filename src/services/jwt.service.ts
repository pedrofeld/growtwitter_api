import {sign} from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

interface JwtUserPayload {
    id: string;
    username: string;
};

export class JwtService {
    // header . payload . signature
    public createToken(data: JwtUserPayload){
        const token = sign(data, process.env.SECRET_KEY!, {
            expiresIn: '1d'
        });
        return token;
    };

    public validateToken(){
        // ..
    };
};