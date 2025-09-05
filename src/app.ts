import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import officeRoutes from './modules/offices/office.route';
import employeeRoutes from './modules/employees/employee.route';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

/**
 * Builds and configures the Fastify application.
 * @returns The configured Fastify instance.
 */
function buildApp() {
    const app = Fastify({
        logger: true, // Enables basic logging
    });

    // --- Swagger (OpenAPI) Documentation Setup ---
    // This block registers the core Swagger plugin to generate the API specification.
    app.register(swagger, {
        swagger: {
            info: {
                title: 'Asset Management API',
                description: 'API documentation for the Asset Management System.',
                version: '1.0.0',
            },
            host: 'localhost:4000', // Update if your host/port changes
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    });

    // This block registers the Swagger UI plugin to serve the interactive documentation page.
    app.register(swaggerUI, {
        routePrefix: '/docs', // Access the UI at http://localhost:4000/docs
        staticCSP: true,
    });

    // --- API Route Registration ---
    // This registers all the routes defined in your [module].route.ts file.

    app.register(officeRoutes, { prefix: '/api/offices' });
    app.register(employeeRoutes, { prefix: '/api/employees' });

    // --- Health Check Route ---
    // A simple route to confirm the server is running.
    app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
        return { status: 'ok' };
    });

    return app;
}

export default buildApp;
