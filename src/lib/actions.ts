'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addJobCard, updateJobCard, updateJobStatus, addClient, addInventoryItem, updateInventoryItem, deleteInventoryItem } from './storage';
import { CreateJobCardInput, JobCard, CreateInventoryItemInput } from './types';

export async function createJobAction(data: CreateJobCardInput) {
    await addJobCard(data);
    revalidatePath('/');
    redirect('/');
}

export async function updateJobAction(id: string, data: CreateJobCardInput) {
    await updateJobCard(id, data);
    revalidatePath('/');
    revalidatePath(`/jobs/${id}`);
    redirect('/');
}

export async function updateJobStatusAction(id: string, status: JobCard['status']) {
    await updateJobStatus(id, status);
    revalidatePath('/');
    revalidatePath(`/jobs/${id}`);
}

export async function createClientAction(name: string) {
    await addClient(name);
    revalidatePath('/inventory');
    redirect('/inventory');
}

export async function createInventoryItemAction(data: CreateInventoryItemInput) {
    await addInventoryItem(data);
    revalidatePath('/inventory');
    revalidatePath(`/inventory/${data.clientId}`);
    redirect(`/inventory/${data.clientId}`);
}

export async function updateInventoryItemAction(clientId: string, id: string, data: Partial<CreateInventoryItemInput>, redirectTo?: string) {
    await updateInventoryItem(id, data);
    revalidatePath('/inventory');
    revalidatePath(`/inventory/${clientId}`);
    revalidatePath(`/inventory/${clientId}/items/${id}`);
    revalidatePath(`/inventory/${clientId}/items/${id}/edit`);
    if (redirectTo) {
        redirect(redirectTo);
    }
}

export async function deleteInventoryItemAction(clientId: string, id: string) {
    await deleteInventoryItem(id);
    revalidatePath('/inventory');
    revalidatePath(`/inventory/${clientId}`);
}
