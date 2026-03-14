-- This script forcefully removes ANY existing permissive policies that allow everyone to read data
-- Then it strictly re-applies the user-only policies.

DO $$ 
DECLARE
    pol record;
BEGIN
    -- 1. Loop through and drop EVERY policy on the clients table
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'clients' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', pol.policyname);
    END LOOP;

    -- 2. Loop through and drop EVERY policy on the inventory_items table
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'inventory_items' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.inventory_items', pol.policyname);
    END LOOP;

    -- 3. Loop through and drop EVERY policy on the job_cards table
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'job_cards' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.job_cards', pol.policyname);
    END LOOP;
END $$;

-- Enable RLS (just in case it was somehow turned off)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;

-- Clients: Only allow users to touch their own records
CREATE POLICY "Users can view their own clients." ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clients." ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients." ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients." ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Inventory: Only allow users to touch their own records
CREATE POLICY "Users can view their own inventory." ON public.inventory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inventory." ON public.inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory." ON public.inventory_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory." ON public.inventory_items FOR DELETE USING (auth.uid() = user_id);

-- Job Cards: Only allow users to touch their own records
CREATE POLICY "Users can view their own job cards." ON public.job_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own job cards." ON public.job_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job cards." ON public.job_cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own job cards." ON public.job_cards FOR DELETE USING (auth.uid() = user_id);
