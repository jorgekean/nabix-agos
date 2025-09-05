import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOfficeInput, OfficeParams, UpdateOfficeInput } from './office.schema';
import { createOffice, getOffices, updateOffice } from './office.service';

/**
 * Handles the creation of a new office.
 */
export async function createOfficeHandler(
    request: FastifyRequest<{ Body: CreateOfficeInput }>,
    reply: FastifyReply
) {
    try {
        const office = await createOffice(request.body);
        return reply.code(201).send(office);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

/**
 * Handles fetching all offices.
 */
export async function getOfficesHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
        const offices = await getOffices();
        return reply.code(200).send(offices);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

/**
 * Handles updating an existing office.
 */
export async function updateOfficeHandler(
    request: FastifyRequest<{ Params: OfficeParams; Body: UpdateOfficeInput }>,
    reply: FastifyReply
) {
    try {
        const { officeId } = request.params;
        const updatedOffice = await updateOffice(officeId, request.body);

        if (!updatedOffice) {
            return reply.code(404).send({ message: 'Office not found' });
        }

        return reply.code(200).send(updatedOffice);
    } catch (e) {
        console.error(e);
        return reply.code(500).send({ message: 'Internal Server Error' });
    }
}

