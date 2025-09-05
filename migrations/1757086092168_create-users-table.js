/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => Promise<void>}
 * @returns {Promise<void>}
 */
exports.up = (pgm) => {
    pgm.createTable('users', {
        user_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
        },
        password_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        role: {
            type: 'varchar(50)',
            notNull: true,
            default: 'USER', // Default role for new users
        },
        employee_id: {
            type: 'uuid',
            notNull: true,
            unique: true, // Each employee can only have one user account
            references: '"employees"', // Foreign key to the employees table
            onDelete: 'CASCADE', // If an employee is deleted, their user account is also deleted
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => Promise<void>}
 * @returns {Promise<void>}
 */
exports.down = (pgm) => {
    pgm.dropTable('users');
};
