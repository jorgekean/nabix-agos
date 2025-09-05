import buildApp from './app';
import 'dotenv/config'; // Ensures environment variables are loaded

const app = buildApp();
const PORT = 4000;

/**
 * Starts the Fastify server.
 */
async function startServer() {
    try {
        // Start listening for requests on the specified port and host
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server listening at http://localhost:${PORT}`);
        console.log(`Swagger docs at http://localhost:${PORT}/docs`);
    } catch (err) {
        // Log any errors that occur during startup and exit
        app.log.error(err);
        process.exit(1);
    }
}

// Start the server
startServer();
