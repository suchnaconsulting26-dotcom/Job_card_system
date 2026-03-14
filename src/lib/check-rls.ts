import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
    console.log("Checking RLS status...");
    
    // Query pg_class to see if RLS is enabled (relrowsecurity)
    const { data, error } = await supabase.rpc('get_rls_status');
    
    if (error) {
        console.error("Failed to check via RPC, trying direct SQL query if possible...", error.message);
        
        // Let's try to just fetch job_cards using the ANON key to see if it returns everything
        const anonClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        const { data: cards, error: cardsError } = await anonClient.from('job_cards').select('id, user_id, party_name').limit(5);
        
        console.log("Anon query returned:", cards?.length, "rows.");
        if (cards && cards.length > 0) {
            console.log("RLS IS FAILING OR DISABLED! Anon user can read data:", cards);
        } else {
            console.log("Anon user cannot read data (Good!) or table is empty.");
        }
    } else {
        console.log("RLS Status:", data);
    }
}

checkRLS();
