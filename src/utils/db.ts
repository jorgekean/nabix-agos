import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new PostgreSQL connection pool.
// The Pool will use the DATABASE_URL environment variable by default.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

(async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully!");
        client.release();
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
})();
export default pool;
