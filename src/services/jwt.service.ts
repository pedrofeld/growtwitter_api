import {Jwt, sign, verify, decode} from 'jsonwebtoken';
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

    public validateToken(token: string): JwtUserPayload | null {
        try {
            const decoded = verify(token, process.env.SECRET_KEY!);
            return decoded as JwtUserPayload;
        } catch (error) {
            console.log('Invalid token:', error);
            return null;
        }
    };
};