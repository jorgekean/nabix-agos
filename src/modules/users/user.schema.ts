import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Schema for the request body when registering a new user
const registerUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    employee_number: z.string().min(1, 'Employee number is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Type definition for the registration input
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// Schema for the request body when logging in
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string(),
});

// Type definition for the login input
export type LoginInput = z.infer<typeof loginSchema>;

// JSON Schema for registration
export const registerUserJsonSchema = {
    body: zodToJsonSchema(registerUserSchema),
    response: {
        201: zodToJsonSchema(z.object({ message: z.string() })),
    },
};

// JSON Schema for login
export const loginJsonSchema = {
    body: zodToJsonSchema(loginSchema),
    response: {
        200: zodToJsonSchema(z.object({ accessToken: z.string() })),
    },
};

