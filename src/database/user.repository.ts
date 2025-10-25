import { handleError } from "../config/error.handler";
import { prisma } from "../config/prisma.config";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export class UserRepository {
    // SELECT * FROM users
    public async findAll() {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // SELECT * FROM users WHERE id = ?
    public async findById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
            });
            return user;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // INSERT INTO users (...) VALUES (...)
    public async create(data: CreateUserDto) {
        try {
            const newUser = await prisma.user.create({
                data
            });
            return newUser;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // UPDATE users SET ... WHERE id = ?
    public async update(id: string, data: UpdateUserDto) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data,
            });
            return updatedUser;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // DELETE FROM users WHERE id = ?
    public async delete(id: string) {
        try {
            const deletedUser = await prisma.user.delete({
                where: { id },
            });
            return deletedUser;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // SELECT * FROM users WHERE email = ?
    public async findByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            return user;
        } catch (error: any) {
            return handleError(error);
        }
    }

    // SELECT * FROM users WHERE username = ?
    public async findByUsername(username: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { username },
            });
            return user;
        } catch (error: any) {
            return handleError(error);
        }
    }
}
