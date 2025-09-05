import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeParams } from './employee.schema';
import { createEmployee, getEmployees, updateEmployee } from './employee.service';

/**
 * Handles the creation of a new employee.
 * @param request - The Fastify request object, containing the employee data in the body.
 * @param reply - The Fastify reply object.
 */
export async function createEmployeeHandler(
    request: FastifyRequest<{ Body: CreateEmployeeInput }>,
    reply: FastifyReply
) {
    try {
        const employee = await createEmployee(request.body);
        return reply.code(201).send(employee);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

/**
 * Handles retrieving all employees.
 * @param request - The Fastify request object.
 * @param reply - The Fastify reply object.
 */
export async function getEmployeesHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const employees = await getEmployees();
        return reply.code(200).send(employees);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

/**
 * Handles updating an existing employee.
 * @param request - The Fastify request object, containing the employee ID and update data.
 * @param reply - The Fastify reply object.
 */
export async function updateEmployeeHandler(
    request: FastifyRequest<{ Body: UpdateEmployeeInput, Params: EmployeeParams }>,
    reply: FastifyReply
) {
    try {
        const { employeeId } = request.params;
        const employee = await updateEmployee(employeeId, request.body);

        if (!employee) {
            return reply.code(404).send({ message: 'Employee not found' });
        }

        return reply.code(200).send(employee);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

