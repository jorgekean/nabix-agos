// Load environment variables from .env file
const result = require('dotenv').config();

// --- START DEBUG CODE ---
if (result.error) {
    console.error("DEBUG: Error loading .env file:", result.error);
} else {
    console.log("DEBUG: .env file loaded successfully.");
    console.log("DEBUG: DATABASE_URL is:", process.env.DATABASE_URL);
}
// --- END DEBUG CODE ---

module.exports = {
    migrationsTable: 'pgmigrations',
    dir: 'migrations',
    checkOrder: false,
    connectionString: process.env.DATABASE_URL,
};