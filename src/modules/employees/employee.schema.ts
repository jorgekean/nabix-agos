import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Schema for the employee object
const employeeSchema = z.object({
    employee_id: z.string().uuid(),
    employee_number: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    current_office_id: z.string().uuid({ message: "Invalid UUID format for office ID" }).nullable(),
});

// Input type for creating an employee
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
// Zod schema for the request body when creating a new employee
const createEmployeeSchema = z.object({
    employee_number: z.string().min(1, { message: 'Employee number is required' }),
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'A valid email is required' }),
    current_office_id: z.string().uuid({ message: "Invalid UUID format for office ID" }).nullable().optional(),
});

// Input type for updating an employee
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
// Zod schema for the request body when updating an employee
const updateEmployeeSchema = createEmployeeSchema.partial(); // All fields are optional

// Zod schema for URL parameters, simplified for Swagger compatibility
const employeeParamsSchema = z.object({
    employeeId: z.string().min(1, { message: 'Employee ID is required.' }),
});
export type EmployeeParams = z.infer<typeof employeeParamsSchema>;


// --- JSON Schemas for Fastify ---
// We convert our Zod schemas to JSON Schemas for Fastify's validation
export const createEmployeeJsonSchema = {
    body: zodToJsonSchema(createEmployeeSchema),
    response: {
        201: zodToJsonSchema(employeeSchema),
    },
};

export const getEmployeesJsonSchema = {
    response: {
        200: zodToJsonSchema(z.array(employeeSchema)),
    },
};

export const updateEmployeeJsonSchema = {
    body: zodToJsonSchema(updateEmployeeSchema),
    params: zodToJsonSchema(employeeParamsSchema),
    response: {
        200: zodToJsonSchema(employeeSchema),
    },
};

