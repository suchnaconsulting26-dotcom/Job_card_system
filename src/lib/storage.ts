'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateJobCardInput, JobCard, JobStatus, Client, InventoryItem, CreateInventoryItemInput } from './types';

// Type guards
function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isJobStatus(value: unknown): value is JobStatus {
    return isString(value) && ['pending', 'in-progress', 'completed', 'hold'].includes(value);
}

// Helper to map DB record to JobCard type with proper validation
function mapRecordToJobCard(record: Record<string, unknown>): JobCard {
    if (!isString(record.id)) throw new Error('Invalid id');
    if (!isNumber(record.job_no)) throw new Error('Invalid job_no');
    if (!isString(record.created_at)) throw new Error('Invalid created_at');
    if (!isString(record.party_name)) throw new Error('Invalid party_name');
    if (!isString(record.box_name)) throw new Error('Invalid box_name');
    if (!isObject(record.box_size)) throw new Error('Invalid box_size');
    if (!isNumber(record.quantity)) throw new Error('Invalid quantity');
    if (!isString(record.ply)) throw new Error('Invalid ply');
    if (!isString(record.top_paper)) throw new Error('Invalid top_paper');
    if (!isString(record.liner)) throw new Error('Invalid liner');
    if (!isString(record.gsm)) throw new Error('Invalid gsm');
    if (!isString(record.printing_color)) throw new Error('Invalid printing_color');
    if (!isBoolean(record.stitching)) throw new Error('Invalid stitching');
    if (!isString(record.order_date)) throw new Error('Invalid order_date');
    if (!isString(record.delivery_date)) throw new Error('Invalid delivery_date');
    if (!isJobStatus(record.status)) throw new Error('Invalid status');
    if (!isString(record.remarks)) throw new Error('Invalid remarks');

    return {
        id: record.id,
        jobNo: record.job_no,
        createdAt: record.created_at,
        partyName: record.party_name,
        boxName: record.box_name,
        boxSize: record.box_size as { l: string; w: string; h: string },
        cuttingSize: isString(record.cutting_size) ? record.cutting_size : undefined,
        decalSize: isString(record.decal_size) ? record.decal_size : undefined,
        quantity: record.quantity,
        ply: record.ply,
        topPaper: record.top_paper,
        liner: record.liner,
        numberOfPapers: isString(record.num_papers) ? record.num_papers : undefined,
        gsm: record.gsm,
        printingColor: record.printing_color,
        stitching: record.stitching,
        orderDate: record.order_date,
        deliveryDate: record.delivery_date,
        readyQuantity: isNumber(record.ready_quantity) ? record.ready_quantity : undefined,
        vehicleNumber: isString(record.vehicle_no) ? record.vehicle_no : undefined,
        status: record.status,
        remarks: record.remarks,
    };
}

// Helper to map JobCard input to DB record (snake_case)
function mapInputToRecord(data: CreateJobCardInput) {
    return {
        party_name: data.partyName,
        box_name: data.boxName,
        box_size: data.boxSize,
        cutting_size: data.cuttingSize,
        decal_size: data.decalSize,
        quantity: data.quantity,
        ply: data.ply,
        top_paper: data.topPaper,
        liner: data.liner,
        num_papers: data.numberOfPapers,
        gsm: data.gsm,
        printing_color: data.printingColor,
        stitching: data.stitching,
        order_date: data.orderDate,
        delivery_date: data.deliveryDate,
        ready_quantity: data.readyQuantity,
        vehicle_no: data.vehicleNumber,
        remarks: data.remarks,
    };
}

export async function getJobCards(): Promise<JobCard[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('job_cards')
        .select('*')
        .order('job_no', { ascending: false });

    if (error) {
        console.error('Error fetching job cards:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        return [];
    }

    return (data || []).map(mapRecordToJobCard);
}

export async function getJobCardById(id: string): Promise<JobCard | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('job_cards')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error('Error fetching job card by id:', error);
        }
        return undefined;
    }

    return mapRecordToJobCard(data);
}

export async function addJobCard(data: CreateJobCardInput): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('You must be logged in to do this.');
    }

    const record = { ...mapInputToRecord(data), user_id: user.id };

    const { error } = await supabase
        .from('job_cards')
        .insert([record]);

    if (error) {
        console.error('Error adding job card:', error);
        throw new Error(`Failed to add job card: ${error.message} (Code: ${error.code})`);
    }
}

export async function updateJobCard(id: string, data: CreateJobCardInput): Promise<void> {
    const supabase = await createClient();
    const record = mapInputToRecord(data);
    const { error } = await supabase
        .from('job_cards')
        .update(record)
        .eq('id', id);

    if (error) {
        console.error('Error updating job card:', error);
        throw new Error('Failed to update job card');
    }
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('job_cards')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('Error updating job status:', error);
        throw new Error('Failed to update job status');
    }
}

export async function deleteJobCard(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('job_cards')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting job card:', error);
        throw new Error('Failed to delete job card');
    }
}

export async function renumberJobCards(): Promise<void> {
    const supabase = await createClient();

    // Get all job cards ordered by job_no descending
    const { data, error: fetchError } = await supabase
        .from('job_cards')
        .select('id')
        .order('job_no', { ascending: false });

    if (fetchError) {
        console.error('Error fetching job cards for renumbering:', fetchError);
        throw new Error('Failed to fetch job cards');
    }

    // Update each card with new sequential numbers
    if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            const newJobNo = data.length - i;
            const { error: updateError } = await supabase
                .from('job_cards')
                .update({ job_no: newJobNo })
                .eq('id', data[i].id);

            if (updateError) {
                console.error('Error updating job number:', updateError);
                throw new Error('Failed to renumber job cards');
            }
        }
    }
}

// Client Storage
export async function getClients(): Promise<Client[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return (data || []).map(record => ({
        id: record.id,
        name: record.name,
        createdAt: record.created_at
    }));
}

export async function addClient(name: string): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('You must be logged in to do this.');
    }

    const { error } = await supabase
        .from('clients')
        .insert([{ name, user_id: user.id }]);

    if (error) {
        console.error('Error adding client:', error);
        throw new Error(`Failed to add client: ${error.message}`);
    }
}

// Inventory Storage
export async function getInventoryItems(clientId?: string): Promise<InventoryItem[]> {
    const supabase = await createClient();
    let query = supabase.from('inventory_items').select('*').order('created_at', { ascending: false });

    if (clientId) {
        query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching inventory items:', error);
        return [];
    }

    return (data || []).map(record => ({
        id: record.id,
        clientId: record.client_id,
        name: record.name,
        description: record.description,
        quantity: record.quantity,
        unit: record.unit,
        itemCode: record.item_code,
        boxSize: record.box_size,
        topPaper: record.top_paper,
        liner: record.liner,
        ply: record.ply,
        gsm: record.gsm,
        cuttingSize: record.cutting_size,
        decalSize: record.decal_size,
        printing: record.printing,
        stitching: record.stitching,
        createdAt: record.created_at,
        updatedAt: record.updated_at
    }));
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error('Error fetching inventory item by id:', error);
        }
        return undefined;
    }

    return {
        id: data.id,
        clientId: data.client_id,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        itemCode: data.item_code,
        boxSize: data.box_size,
        topPaper: data.top_paper,
        liner: data.liner,
        ply: data.ply,
        gsm: data.gsm,
        cuttingSize: data.cutting_size,
        decalSize: data.decal_size,
        printing: data.printing,
        stitching: data.stitching,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
}

export async function addInventoryItem(data: CreateInventoryItemInput): Promise<void> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('You must be logged in to do this.');
    }

    const { error } = await supabase
        .from('inventory_items')
        .insert([{
            client_id: data.clientId,
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            unit: data.unit,
            item_code: data.itemCode,
            box_size: data.boxSize,
            top_paper: data.topPaper,
            liner: data.liner,
            ply: data.ply,
            gsm: data.gsm,
            cutting_size: data.cuttingSize,
            decal_size: data.decalSize,
            printing: data.printing,
            stitching: data.stitching,
            user_id: user.id
        }]);

    if (error) {
        console.error('Error adding inventory item:', error);
        throw new Error(`Failed to add inventory item: ${error.message}`);
    }
}

export async function updateInventoryItem(id: string, data: Partial<CreateInventoryItemInput>): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('inventory_items')
        .update({
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            unit: data.unit,
            item_code: data.itemCode,
            box_size: data.boxSize,
            top_paper: data.topPaper,
            liner: data.liner,
            ply: data.ply,
            gsm: data.gsm,
            cutting_size: data.cuttingSize,
            decal_size: data.decalSize,
            printing: data.printing,
            stitching: data.stitching,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating inventory item:', error);
        throw new Error('Failed to update inventory item');
    }
}

export async function deleteInventoryItem(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting inventory item:', error);
        throw new Error('Failed to delete inventory item');
    }
}
