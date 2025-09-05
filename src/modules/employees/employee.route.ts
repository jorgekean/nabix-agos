import { FastifyInstance } from 'fastify';
import { createEmployeeHandler, getEmployeesHandler, updateEmployeeHandler } from './employee.controller';
import { createEmployeeJsonSchema, getEmployeesJsonSchema, updateEmployeeJsonSchema } from './employee.schema';


async function employeeRoutes(server: FastifyInstance) {
    server.post(
        '/',
        {
            preHandler: [server.authenticate], // Secure this route
            schema: createEmployeeJsonSchema,
        },
        createEmployeeHandler as any
    );

    server.get(
        '/',
        {
            preHandler: [server.authenticate], // Secure this route
            schema: getEmployeesJsonSchema,
        },
        getEmployeesHandler
    );

    server.put(
        '/:employeeId',
        {
            preHandler: [server.authenticate], // Secure this route
            schema: updateEmployeeJsonSchema,
        },
        updateEmployeeHandler as any
    );
}

export default employeeRoutes;

