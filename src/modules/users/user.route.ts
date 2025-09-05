import { FastifyInstance } from 'fastify';
import { registerUserHandler, loginHandler } from './user.controller';
import { registerUserJsonSchema, loginJsonSchema } from './user.schema';

/**
 * Defines and registers the routes for the users module.
 * @param server The Fastify instance.
 */
async function userRoutes(server: FastifyInstance) {
    // Route for user registration
    server.post(
        '/register',
        {
            schema: registerUserJsonSchema,
        },
        registerUserHandler
    );

    // Route for user login
    server.post(
        '/login',
        {
            schema: loginJsonSchema,
        },
        loginHandler
    );
}

export default userRoutes;

