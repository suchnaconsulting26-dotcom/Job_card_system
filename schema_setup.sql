-- Create ENUM for Job Status
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'in-progress', 'completed', 'hold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add user_id column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.clients ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Make user_id NOT NULL for new setups (or if you already have valid data, this part requires all rows to have a user_id)
-- Note: If you already have rows without user_id, you will need to set a default or update them before running this.
-- For a fresh project, this is fine.
-- ALTER TABLE public.clients ALTER COLUMN user_id SET NOT NULL; 

-- 2. Inventory Items Table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0 NOT NULL,
    unit TEXT NOT NULL,
    
    -- Detailed Specs
    item_code TEXT,
    box_size_l TEXT,
    box_size_w TEXT,
    box_size_h TEXT,
    top_paper TEXT,
    liner TEXT,
    ply TEXT,
    gsm TEXT,
    cutting_size TEXT,
    decal_size TEXT,
    printing TEXT,
    stitching BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add user_id column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.inventory_items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- 3. Job Cards Table
CREATE TABLE IF NOT EXISTS public.job_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_no SERIAL, -- Auto-incrementing job number
    
    -- Client Info
    party_name TEXT NOT NULL,
    
    -- Box Details
    box_name TEXT NOT NULL,
    box_size_l TEXT NOT NULL,
    box_size_w TEXT NOT NULL,
    box_size_h TEXT NOT NULL,
    cutting_size TEXT,
    decal_size TEXT,
    quantity INTEGER NOT NULL,
    
    -- Material Specs
    ply TEXT NOT NULL,
    top_paper TEXT NOT NULL,
    liner TEXT NOT NULL,
    number_of_papers TEXT,
    gsm TEXT NOT NULL,
    
    -- Production
    printing_color TEXT NOT NULL,
    stitching BOOLEAN DEFAULT false NOT NULL,
    
    -- Dates
    order_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    
    -- Shipment Info
    ready_quantity INTEGER DEFAULT 0,
    vehicle_number TEXT,
    
    -- Status & Notes
    status job_status DEFAULT 'pending' NOT NULL,
    remarks TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add user_id column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.job_cards ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) SETUP
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-runs)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own clients." ON public.clients;
    DROP POLICY IF EXISTS "Users can insert their own clients." ON public.clients;
    DROP POLICY IF EXISTS "Users can update their own clients." ON public.clients;
    DROP POLICY IF EXISTS "Users can delete their own clients." ON public.clients;

    DROP POLICY IF EXISTS "Users can view their own inventory." ON public.inventory_items;
    DROP POLICY IF EXISTS "Users can insert their own inventory." ON public.inventory_items;
    DROP POLICY IF EXISTS "Users can update their own inventory." ON public.inventory_items;
    DROP POLICY IF EXISTS "Users can delete their own inventory." ON public.inventory_items;

    DROP POLICY IF EXISTS "Users can view their own job cards." ON public.job_cards;
    DROP POLICY IF EXISTS "Users can insert their own job cards." ON public.job_cards;
    DROP POLICY IF EXISTS "Users can update their own job cards." ON public.job_cards;
    DROP POLICY IF EXISTS "Users can delete their own job cards." ON public.job_cards;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Clients Policies
CREATE POLICY "Users can view their own clients." 
ON public.clients FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients." 
ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients." 
ON public.clients FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients." 
ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Inventory Items Policies
CREATE POLICY "Users can view their own inventory." 
ON public.inventory_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory." 
ON public.inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory." 
ON public.inventory_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory." 
ON public.inventory_items FOR DELETE USING (auth.uid() = user_id);

-- Job Cards Policies
CREATE POLICY "Users can view their own job cards." 
ON public.job_cards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job cards." 
ON public.job_cards FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job cards." 
ON public.job_cards FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job cards." 
ON public.job_cards FOR DELETE USING (auth.uid() = user_id);
