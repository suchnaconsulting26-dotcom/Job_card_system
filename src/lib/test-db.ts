import { supabase } from './supabase';

export async function testDb() {
    const { data } = await supabase.from('job_cards').select('id, user_id');
    console.log(data);
}
testDb();
