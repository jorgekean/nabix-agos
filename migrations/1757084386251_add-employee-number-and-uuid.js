/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => Promise<void>}
 * @returns {Promise<void>}
 */
exports.up = async (pgm) => {
    // Enable the UUID generation extension if it doesn't already exist
    pgm.createExtension('uuid-ossp', { ifNotExists: true });

    // 1. Add the new employee_number column
    pgm.addColumns('employees', {
        employee_number: {
            type: 'varchar(50)',
            notNull: true,
            unique: true,
        },
    });

    // 2. Change the employee_id from SERIAL to UUID
    // Using { cascade: true } to automatically drop any dependent objects.
    pgm.dropConstraint('employees', 'employees_pkey', { cascade: true });
    pgm.alterColumn('employees', 'employee_id', {
        type: 'UUID USING (uuid_generate_v4())',
        default: pgm.func('uuid_generate_v4()'),
    });
    pgm.addConstraint('employees', 'employees_pkey', { primaryKey: 'employee_id' });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => Promise<void>}
 * @returns {Promise<void>}
 */
exports.down = (pgm) => {
    // 1. Remove the employee_number column
    pgm.dropColumns('employees', ['employee_number']);

    // 2. Reverting the employee_id from UUID back to SERIAL is a complex
    // and potentially destructive operation, so it is omitted here for simplicity.
    // In a production environment, this would require a more careful data migration strategy.
    pgm.dropConstraint('employees', 'employees_pkey', { cascade: true });
    pgm.alterColumn('employees', 'employee_id', {
        type: 'serial',
    });
    pgm.addConstraint('employees', 'employees_pkey', { primaryKey: 'employee_id' });
};

