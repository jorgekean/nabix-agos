import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== ZOD SCHEMAS =====
// This is our single source of truth for validation rules and data shapes.

// Schema for creating a new office
const createOfficeSchema = z.object({
    office_name: z.string().min(1, { message: 'Office name is required' }),
    address: z.string().optional(),
});

// Schema for the API response for a single office
const officeResponseSchema = z.object({
    office_id: z.string().uuid(),
    office_name: z.string(),
    address: z.string().nullable(),
});

// Schema for the API response for a list of offices
const officesResponseSchema = z.array(officeResponseSchema);

// Schema for URL parameters targeting a specific office
const officeParamsSchema = z.object({
    officeId: z.string().uuid({ message: 'Valid Office ID is required' }),
});

// Schema for updating an office
const updateOfficeSchema = z
    .object({
        office_name: z.string().optional(),
        address: z.string().optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
        message: 'At least one field to update must be provided',
    });

// ===== INFERRED TYPES =====
// We infer our TypeScript types directly from the Zod schemas.

export type CreateOfficeInput = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;
export type OfficeParams = z.infer<typeof officeParamsSchema>;

// ===== SIMPLIFIED FASTIFY SCHEMAS =====
// We convert our Zod schemas directly into the JSON schema format that Fastify expects.
// The response schemas are now inlined, removing the need for $ref.

export const createOfficeJsonSchema = {
    body: zodToJsonSchema(createOfficeSchema),
    response: {
        201: zodToJsonSchema(officeResponseSchema),
    },
};

export const getOfficesJsonSchema = {
    response: {
        200: zodToJsonSchema(officesResponseSchema),
    },
};

export const updateOfficeJsonSchema = {
    params: zodToJsonSchema(officeParamsSchema),
    body: zodToJsonSchema(updateOfficeSchema),
    response: {
        200: zodToJsonSchema(officeResponseSchema),
    },
};

