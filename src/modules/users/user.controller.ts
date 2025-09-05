import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterUserInput, LoginInput } from './user.schema';
import { findEmployeeForRegistration, createUser, findUserByEmail } from './user.service';
import bcrypt from 'bcryptjs';

/**
 * Handles the user registration process.
 * @param request The Fastify request object.
 * @param reply The Fastify reply object.
 */
export async function registerUserHandler(
    request: FastifyRequest<{ Body: RegisterUserInput }>,
    reply: FastifyReply
) {
    const { email, employee_number, password } = request.body;

    try {
        const { employee, userExists } = await findEmployeeForRegistration(email, employee_number);

        if (!employee) {
            return reply.code(404).send({ message: 'Employee with this email and number not found' });
        }

        if (userExists) {
            return reply.code(409).send({ message: 'User account already exists for this employee' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(hashedPassword, employee.employee_id);

        return reply.code(201).send({ message: 'User account created successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

/**
 * Handles the user login process.
 * @param request The Fastify request object.
 * @param reply The Fastify reply object.
 */
export async function loginHandler(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
) {
    const { email, password } = request.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return reply.code(401).send({ message: 'Invalid email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return reply.code(401).send({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const accessToken = request.server.jwt.sign({
            userId: user.user_id,
            email: user.email,
            role: user.role,
        });

        return reply.code(200).send({ accessToken });
    } catch (error) {
        console.error('Login Error:', error);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

