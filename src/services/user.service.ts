import * as bcrypt from "bcrypt";
import { UserRepository } from "../database/user.repository";
import { JwtService } from "./jwt.service";
import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";

export class UserService {
  private repo = new UserRepository();
  private jwt = new JwtService();

  // 1 - Get all users (non-mandatory method)
  async getAll() {
    try {
      return this.repo.findAll();
    } catch (error: any) {
      return handleError(error);
    }
  }

  // 2 - Get user by ID
  async getById(id: string) {
    try {
      const user = await this.repo.findById(id);
      if (!user){
        throw new Error("User not found");
      }
      const followers = await this.repo.getFollowers(id);
      const following =  await this.repo.getFollowing(id);
      return {
        ...user,
        followers, 
        following 
      };
    } catch (error: any) {
      return handleError(error);
    }
  }

  // 3 - Create new user
  async create(data: any) {
    try {
      if (!data.name) {
        throw new Error("Name is required");
      }
      if (!data.username) {
        throw new Error("Username is required");
      }
      if (!data.email) {
        throw new Error("Email is required");
      }
      if (!data.password) {
        throw new Error("Password is required");
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await this.repo.create({
        ...data,
        password: hashedPassword
      });
      if (!newUser) {
        throw new Error("Error creating user");
      }
      return this.repo.create({ 
        ...data, 
        password: hashedPassword 
      });
    } catch (error) {
      return handleError(error);
    }
  }

  // 4 - Update user
  async update(id: string, data: any) {
    try {
      if (!id){
        throw new Error("ID is required");
      }
      if (!data){
        throw new Error("New data is required to update");
      }
      const user = await this.repo.findById(id);
      if (!user){
        throw new Error("User not found");
      }
      const updatedUser = await this.repo.update(id, data);
      if(!updatedUser){
        throw new Error("No changes made");
      }
      return updatedUser;
    } catch (error: any) {
      return handleError(error);
    }
  }

  // 5 - Delete user
  async delete(id: string) {
    try {
      if (!id){
        throw new Error("ID is required");
      }
      const user = await this.repo.findById(id);
      if (!user){
        throw new Error("User not found");
      }
      const deletedUser = await this.repo.delete(id);
      return deletedUser;
    } catch (error: any) {
      return handleError(error);
    }
  }

  // 6 - User login
  async login(login: string, password: string) {
    try {
      let user = await this.repo.findByEmail(login);
      if (!user){
        user = await this.repo.findByUsername(login);
      } 
      if (!user){
        throw new Error("User not found");
      } 
      const valid = await bcrypt.compare(password, user.password);
      if (!valid){
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