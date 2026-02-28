"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
;
class JwtService {
    // header . payload . signature
    createToken(data) {
        const token = (0, jsonwebtoken_1.sign)(data, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });
        return token;
    }
    ;
    validateToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.SECRET_KEY);
            return decoded;
        }
        catch (error) {
            console.log('Invalid token:', error);
            return null;
        }
    }
    ;
}
exports.JwtService = JwtService;
;
