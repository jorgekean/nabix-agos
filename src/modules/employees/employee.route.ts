import { FastifyInstance } from 'fastify';
import { createEmployeeHandler, getEmployeesHandler, updateEmployeeHandler } from './employee.controller';
import { createEmployeeJsonSchema, getEmployeesJsonSchema, updateEmployeeJsonSchema } from './employee.schema';

/**
 * Defines and registers the routes for the employees module.
 * @param server - The Fastify instance.
 */
async function employeeRoutes(server: FastifyInstance) {

    // Route to create a new employee
    server.post(
        '/',
        {
            schema: createEmployeeJsonSchema,
        },
        createEmployeeHandler
    );

    // Route to get all employees
    server.get(
        '/',
        {
            schema: getEmployeesJsonSchema,
        },
        getEmployeesHandler
    );

    // Route to update an employee
    server.put(
        '/:employeeId',
        {
            schema: updateEmployeeJsonSchema,
        },
        updateEmployeeHandler
    );
}

export default employeeRoutes;
