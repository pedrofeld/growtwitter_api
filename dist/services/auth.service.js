"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const user_repository_1 = require("../database/user.repository");
const jwt_service_1 = require("./jwt.service");
const error_handler_1 = require("../config/error.handler");
class AuthService {
    repo = new user_repository_1.UserRepository();
    jwt = new jwt_service_1.JwtService();
    async login(login, password) {
        try {
            if (!login || !password) {
                throw new Error("Login and password are required");
            }
            let user = await this.repo.findByEmail(login);
            if (!user) {
                user = await this.repo.findByUsername(login);
            }
            if (!user) {
                throw new Error("User not found");
            }
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error("Invalid credentials");
            }
            const token = this.jwt.createToken({
                id: user.id,
                username: user.username,
            });
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                },
                token,
            };
        }
        catch (error) {
            return (0, error_handler_1.handleError)(error);
        }
    }
}
exports.AuthService = AuthService;
