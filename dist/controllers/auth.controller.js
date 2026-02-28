"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async login(req, res) {
        try {
            const { login, password } = req.body;
            const result = await authService.login(login, password);
            if (!result) {
                return res.status(401).json({
                    ok: false,
                    message: "Invalid login credentials",
                });
            }
            res.status(200).json({
                ok: true,
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
            res.status(401).json({
                ok: false,
                message: "Login failed",
                error: error.message,
            });
        }
    }
}
exports.AuthController = AuthController;
