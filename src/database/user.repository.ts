import { prisma } from "../config/prisma.config";
import { CreateUserDto } from "../dtos/create-user.dto";

export class UserRepository {
    // SELECT * FROM users
    public async findAll() {
        const users = await prisma.user.findMany();
        return users;
    }

    // SELECT * FROM users WHERE id = ?
    public async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    // INSERT INTO users (...) VALUES (...)
    public async create(data: CreateUserDto) {
        const newUser = await prisma.user.create({
            data
        });
        return newUser;
    }

    // UPDATE users SET ... WHERE id = ?
    public async update(id: string, data: any) {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
        });
        return updatedUser;
    }

    // DELETE FROM users WHERE id = ?
    public async delete(id: string) {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        return deletedUser;
    }
}
