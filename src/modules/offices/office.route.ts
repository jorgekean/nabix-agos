import { FastifyInstance } from 'fastify';
import { createOfficeHandler, getOfficesHandler, updateOfficeHandler } from './office.controller';
import { createOfficeJsonSchema, getOfficesJsonSchema, updateOfficeJsonSchema } from './office.schema';

/**
 * Defines and registers the routes for the offices module.
 * @param server - The Fastify instance.
 */
async function officeRoutes(server: FastifyInstance) {

    // Route to create a new office
    server.post(
        '/',
        {
            schema: createOfficeJsonSchema,
        },
        createOfficeHandler
    );

    // Route to get all offices
    server.get(
        '/',
        {
            schema: getOfficesJsonSchema,
        },
        getOfficesHandler
    );

    // Route to update an office
    server.put(
        '/:officeId',
        {
            schema: updateOfficeJsonSchema,
        },
        updateOfficeHandler
    );
}

export default officeRoutes;

