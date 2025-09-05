import pool from '../../utils/db';
import { CreateEmployeeInput, UpdateEmployeeInput } from './employee.schema';

/**
 * Creates a new employee in the database.
 * @param data - The data for the new employee.
 * @returns The newly created employee.
 */
export async function createEmployee(data: CreateEmployeeInput) {
    const { employee_number, first_name, last_name, email, current_office_id } = data;
    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO employees(employee_number, first_name, last_name, email, current_office_id) 
       VALUES($1, $2, $3, $4, $5) 
       RETURNING *`,
            [employee_number, first_name, last_name, email, current_office_id]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

/**
 * Retrieves all employees from the database.
 * @returns An array of all employees.
 */
export async function getEmployees() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM employees ORDER BY last_name, first_name');
        return result.rows;
    } finally {
        client.release();
    }
}

/**
 * Updates an existing employee in the database.
 * @param employeeId - The UUID of the employee to update.
 * @param data - The data to update the employee with.
 * @returns The updated employee or null if not found.
 */
export async function updateEmployee(employeeId: string, data: UpdateEmployeeInput) {
    const client = await pool.connect();
    try {
        const fields = Object.keys(data);
        const values = Object.values(data);

        // Return early if there's nothing to update
        if (fields.length === 0) {
            const existing = await client.query('SELECT * FROM employees WHERE employee_id = $1', [employeeId]);
            return existing.rows[0] || null;
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

        const query = `
      UPDATE employees 
      SET ${setClause} 
      WHERE employee_id = $1 
      RETURNING *`;

        const result = await client.query(query, [employeeId, ...values]);

        return result.rows[0] || null;
    } finally {
        client.release();
    }
}

