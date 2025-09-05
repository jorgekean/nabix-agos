import pool from '../../utils/db';
import { CreateOfficeInput, UpdateOfficeInput } from './office.schema';

/**
 * Creates a new office in the database.
 * @param data - The data for the new office.
 * @returns The newly created office.
 */
export async function createOffice(data: CreateOfficeInput) {
    const { office_name, address } = data;
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO offices(office_name, address) VALUES($1, $2) RETURNING office_id, office_name, address',
            [office_name, address]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Retrieves all offices from the database.
 * @returns An array of all offices.
 */
export async function getOffices() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT office_id, office_name, address FROM offices ORDER BY office_name');
        return result.rows;
    } finally {
        client.release();
    }
}

/**
 * Updates an existing office in the database.
 * @param officeId - The ID of the office to update.
 * @param data - The data to update the office with.
 * @returns The updated office.
 */
export async function updateOffice(officeId: string, data: UpdateOfficeInput) {
    const client = await pool.connect();
    try {
        // Dynamically build the update query based on provided fields
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

        const query = `
      UPDATE offices 
      SET ${setClause} 
      WHERE office_id = $1 
      RETURNING office_id, office_name, address`;

        const result = await client.query(query, [officeId, ...values]);

        if (result.rowCount === 0) {
            return null; // Indicates that the office was not found
        }

        return result.rows[0];
    } finally {
        client.release();
    }
}

