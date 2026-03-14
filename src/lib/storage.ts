'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateJobCardInput, JobCard, JobStatus, Client, InventoryItem, CreateInventoryItemInput } from './types';


// Helper to map DB record to JobCard type
function mapRecordToJobCard(record: Record<string, unknown>): JobCard {
    return {
        id: record.id as string,
        jobNo: record.job_no as number,
        createdAt: record.created_at as string,
        partyName: record.party_name as string,
        boxName: record.box_name as string,
        boxSize: record.box_size as { l: string; w: string; h: string },
        cuttingSize: record.cutting_size as string | undefined,
        decalSize: record.decal_size as string | undefined,
        quantity: record.quantity as number,
        ply: record.ply as string,
        topPaper: record.top_paper as string,
        liner: record.liner as string,
        numberOfPapers: record.num_papers as string | undefined,
        gsm: record.gsm as string,
        printingColor: record.printing_color as string,
        stitching: record.stitching as boolean,
        orderDate: record.order_date as string,
        deliveryDate: record.delivery_date as string,
        readyQuantity: record.ready_quantity as number | undefined,
        vehicleNumber: record.vehicle_no as string | undefined,
        status: record.status as JobStatus,
        remarks: record.remarks as string,
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
