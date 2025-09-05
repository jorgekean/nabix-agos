import '@fastify/jwt'

// This declaration file augments the Fastify and @fastify/jwt modules.

declare module 'fastify' {
    /**
     * Extends the FastifyRequest interface to include the 'user' property,
     * which will be populated by the authentication hook after a successful JWT verification.
     */
    interface FastifyRequest {
        user: {
            employee_id: string;
            email: string;
            role: 'USER' | 'ADMIN';
            // iat is the "issued at" timestamp from the JWT payload
            iat: number;
        }
    }
}

declare module '@fastify/jwt' {
    /**
     * Extends the FastifyJWT interface to define the shape of the payload
     * that we sign and the shape of the 'user' object that is decoded.
     */
    interface FastifyJWT {
        payload: {
            employee_id: string;
            email: string;
            role: 'USER' | 'ADMIN';
        };
        user: {
            employee_id: string;
            email: string;
            role: 'USER' | 'ADMIN';
            iat: number;
        }
    }
}

