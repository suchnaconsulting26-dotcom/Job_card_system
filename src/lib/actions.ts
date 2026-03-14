'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addJobCard, updateJobCard, updateJobStatus, deleteJobCard, renumberJobCards, addClient, addInventoryItem, updateInventoryItem, deleteInventoryItem } from './storage';
import { CreateJobCardInput, JobCard, CreateInventoryItemInput } from './types';

// Validation Schemas
const boxSizeSchema = z.object({
    l: z.string().min(1, 'Length is required').max(50),
    w: z.string().min(1, 'Width is required').max(50),
    h: z.string().min(1, 'Height is required').max(50),
});

const dateStringSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .transform(date => new Date(date + 'T00:00:00Z').toISOString());

const jobCardSchema = z.object({
    partyName: z.string().min(1, 'Party name is required').max(255),
    boxName: z.string().min(1, 'Box name is required').max(255),
    boxSize: boxSizeSchema,
    cuttingSize: z.string().max(50).optional(),
    decalSize: z.string().max(50).optional(),
    quantity: z.number().int().positive('Quantity must be a positive number'),
    ply: z.string().min(1, 'Ply is required').max(50),
    topPaper: z.string().min(1, 'Top paper is required').max(255),
    liner: z.string().min(1, 'Liner is required').max(255),
    numberOfPapers: z.string().max(50).optional(),
    gsm: z.string().min(1, 'GSM is required').max(50),
    printingColor: z.string().min(1, 'Printing color is required').max(255),
    stitching: z.boolean(),
    orderDate: dateStringSchema,
    deliveryDate: dateStringSchema,
    readyQuantity: z.number().int().nonnegative().optional(),
    vehicleNumber: z.string().max(50).optional(),
    remarks: z.string().max(1000).default(''),
});

const clientNameSchema = z.object({
    name: z.string().min(1, 'Client name is required').max(255),
});

const inventoryItemSchema = z.object({
    clientId: z.string().uuid('Invalid client ID'),
    name: z.string().min(1, 'Item name is required').max(255),
    description: z.string().max(1000).optional(),
    quantity: z.number().int().nonnegative('Quantity cannot be negative'),
    unit: z.string().min(1, 'Unit is required').max(50),
    itemCode: z.string().max(100).optional(),
    boxSize: boxSizeSchema.optional(),
    topPaper: z.string().max(255).optional(),
    liner: z.string().max(255).optional(),
    ply: z.string().max(50).optional(),
    gsm: z.string().max(50).optional(),
    cuttingSize: z.string().max(50).optional(),
    decalSize: z.string().max(50).optional(),
    printing: z.string().max(255).optional(),
    stitching: z.boolean().optional(),
});

export async function createJobAction(data: CreateJobCardInput) {
    try {
        const validated = jobCardSchema.parse(data);
        await addJobCard(validated);
        revalidatePath('/');
        return { redirectTo: '/' };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues[0]?.message || 'Validation failed';
            throw new Error(`Validation failed: ${message}`);
        }
        throw error;
    }
}

export async function updateJobAction(id: string, data: CreateJobCardInput) {
    try {
        const validated = jobCardSchema.parse(data);
        await updateJobCard(id, validated);
        revalidatePath('/');
        revalidatePath(`/jobs/${id}`);
        return { redirectTo: '/' };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues[0]?.message || 'Validation failed';
            throw new Error(`Validation failed: ${message}`);
        }
        throw error;
    }
}

export async function updateJobStatusAction(id: string, status: JobCard['status']) {
    const validStatuses = ['pending', 'in-progress', 'completed', 'hold'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
    }
    await updateJobStatus(id, status);
    revalidatePath('/');
    revalidatePath(`/jobs/${id}`);
}

export async function deleteJobCardAction(id: string) {
    try {
        await deleteJobCard(id);
        await renumberJobCards();
        revalidatePath('/');
    } catch (error) {
        throw error;
    }
}

export async function createClientAction(name: string) {
    try {
        const validated = clientNameSchema.parse({ name });
        await addClient(validated.name);
        revalidatePath('/inventory');
        return { redirectTo: '/inventory' };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues[0]?.message || 'Validation failed';
            throw new Error(`Validation failed: ${message}`);
        }
        throw error;
    }
}

export async function createInventoryItemAction(data: CreateInventoryItemInput) {
    try {
        const validated = inventoryItemSchema.parse(data);
        await addInventoryItem(validated);
        revalidatePath('/inventory');
        revalidatePath(`/inventory/${data.clientId}`);
        return { redirectTo: `/inventory/${data.clientId}` };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues[0]?.message || 'Validation failed';
            throw new Error(`Validation failed: ${message}`);
        }
        throw error;
    }
}

export async function updateInventoryItemAction(clientId: string, id: string, data: Partial<CreateInventoryItemInput>, redirectTo?: string) {
    try {
        const validated = inventoryItemSchema.partial().parse(data);
        await updateInventoryItem(id, validated);
        revalidatePath('/inventory');
        revalidatePath(`/inventory/${clientId}`);
        revalidatePath(`/inventory/${clientId}/items/${id}`);
        revalidatePath(`/inventory/${clientId}/items/${id}/edit`);
        return redirectTo ? { redirectTo } : { redirectTo: null };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const message = error.issues[0]?.message || 'Validation failed';
            throw new Error(`Validation failed: ${message}`);
        }
        throw error;
    }
}

export async function deleteInventoryItemAction(clientId: string, id: string) {
    try {
        if (!id || !clientId) {
            throw new Error('Invalid ID values');
        }
        await deleteInventoryItem(id);
        revalidatePath('/inventory');
        revalidatePath(`/inventory/${clientId}`);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation failed: ${error.issues[0]?.message || 'Validation failed'}`);
        }
        throw error;
    }
}
