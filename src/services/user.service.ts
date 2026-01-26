import * as bcrypt from "bcrypt";
import { UserRepository } from "../database/user.repository";
import { handleError } from "../config/error.handler";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { CreateUserDto } from "../dtos/create-user.dto";

export class UserService {
  private repo = new UserRepository();

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
  async create(data: CreateUserDto) {
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
  async update(id: string, data: UpdateUserDto) {
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
}