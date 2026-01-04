-- FIX MESSAGES SCHEMA
-- Run this to fix the 400 Bad Request on messages

-- 1. Add missing columns for deletion status
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_by_sender BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_by_receiver BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false; -- Just in case

-- 2. Ensure RLS policies allow updating these
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 3. Verify Foreign Keys again (Safety check)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_sender_id_profiles_fkey'
    ) THEN
        ALTER TABLE messages 
        ADD CONSTRAINT messages_sender_id_profiles_fkey 
        FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_receiver_id_profiles_fkey'
    ) THEN
        ALTER TABLE messages 
        ADD CONSTRAINT messages_receiver_id_profiles_fkey 
        FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
