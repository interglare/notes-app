import { User } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/auth';
import { BasicServiceResponse } from '../entities/basicServiceResponse';
import prisma from '../prisma';


class AuthService {
    async signup(email: string, password: string, name?: string): Promise<BasicServiceResponse<User>> {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new BasicServiceResponse(true, 'User already exists');
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                name,
            },
        });

        await prisma.password.create({
            data: {
                userId: user.id,
                hash: hashedPassword,
            },
        });

        return new BasicServiceResponse(user, false, 'User created successfully');
    }

    async login(email: string, password: string): Promise<BasicServiceResponse<User>> {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { password: true },
        });

        if (!user || !(await comparePassword(password, user.password!.hash))) {
            return new BasicServiceResponse(true, 'Invalid email or password');
        }

        const { password: _, ...rest } = user;

        return new BasicServiceResponse(user, false, 'Login successful');
    }
}

export default AuthService;
