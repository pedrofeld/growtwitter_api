import * as bcrypt from "bcrypt";
import { UserRepository } from "../database/user.repository";
import { JwtService } from "./jwt.service";
import { handleError } from "../config/error.handler";

export class AuthService {
  private repo = new UserRepository();
  private jwt = new JwtService();

  async login(login: string, password: string) {
    try {
      if (!login || !password) {
        throw new Error("Login and password are required");
      }
      let user = await this.repo.findByEmail(login);
      if (!user){
        user = await this.repo.findByUsername(login);
      } 
      if (!user){
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
    } catch (error: any) {
      return handleError(error);
    }
  }
}