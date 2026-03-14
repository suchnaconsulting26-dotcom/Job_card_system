-- Script to assign all orphaned data (data without a user_id) to a specific user.
-- This fixes the issue where pre-existing data became invisible after enabling RLS.

DO $$ 
DECLARE
    -- We will find the FIRST registered user and assign all orphaned data to them.
    -- If you want to assign it to a specific email, you can change the query below.
    target_user_id UUID;
BEGIN
    -- Get the ID of the first user who signed up
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;

    IF target_user_id IS NOT NULL THEN
        -- 1. Update Clients
        UPDATE public.clients 
        SET user_id = target_user_id 
        WHERE user_id IS NULL;

        -- 2. Update Inventory Items
        UPDATE public.inventory_items 
        SET user_id = target_user_id 
        WHERE user_id IS NULL;

        -- 3. Update Job Cards
        UPDATE public.job_cards 
        SET user_id = target_user_id 
        WHERE user_id IS NULL;

        RAISE NOTICE 'Successfully assigned orphaned data to user ID %', target_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users. Please sign up first.';
    END IF;
END $$;
