import pool from '../../utils/db';
import { RegisterUserInput } from './user.schema';

/**
 * Finds an employee by email and employee number to verify for registration.
 * Also checks if a user account already exists for that employee.
 * @param email - The employee's email.
 * @param employee_number - The employee's unique number.
 * @returns An object containing the employee record and a boolean indicating if a user exists.
 */
export async function findEmployeeForRegistration(email: string, employee_number: string) {
    const employeeResult = await pool.query(
        'SELECT employee_id FROM employees WHERE email = $1 AND employee_number = $2',
        [email, employee_number]
    );

    if (employeeResult.rowCount === 0) {
        return { employee: null, userExists: false };
    }

    const employee = employeeResult.rows[0];

    const userResult = await pool.query('SELECT user_id FROM users WHERE employee_id = $1', [
        employee.employee_id,
    ]);

    // Fix: Use nullish coalescing operator (??) to default null to 0
    const userExists = (userResult.rowCount ?? 0) > 0;

    return { employee, userExists };
}

/**
 * Creates a new user in the database.
 * @param password_hash - The securely hashed password.
 * @param employee_id - The UUID of the employee to link the user to.
 */
export async function createUser(password_hash: string, employee_id: string) {
    await pool.query(
        'INSERT INTO users (password_hash, employee_id) VALUES ($1, $2)',
        [password_hash, employee_id]
    );
}

/**
 * Finds a user by their email for the login process.
 * Joins with the employees table to get the email.
 * @param email The user's email.
 * @returns The user record including password hash and role, or null if not found.
 */
export async function findUserByEmail(email: string) {
    const query = `
        SELECT u.user_id, u.password_hash, u.role, e.email
        FROM users u
        JOIN employees e ON u.employee_id = e.employee_id
        WHERE e.email = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
        return null;
    }

    return result.rows[0];
}

