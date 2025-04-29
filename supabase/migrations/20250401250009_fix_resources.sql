-- Drop all existing resource policies
DROP POLICY IF EXISTS "Users can view their own resources" ON resources;
DROP POLICY IF EXISTS "Users can insert their own resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON resources;
DROP POLICY IF EXISTS "resources_select_policy" ON resources;
DROP POLICY IF EXISTS "resources_insert_policy" ON resources;
DROP POLICY IF EXISTS "resources_update_policy" ON resources;
DROP POLICY IF EXISTS "resources_delete_policy" ON resources;

-- Create simplified resource policies
CREATE POLICY "resources_select_policy" ON resources
    FOR SELECT
    USING (true);

CREATE POLICY "resources_insert_policy" ON resources
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resources_update_policy" ON resources
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "resources_delete_policy" ON resources
    FOR DELETE
    USING (auth.uid() = user_id);

-- Reset resources table
TRUNCATE TABLE resources CASCADE;

-- Insert public resources
INSERT INTO resources (id, title, type, description, author, category, rating, bookmarked, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'Emergency Preparedness Guide', 'Document', 'Comprehensive guide for emergency situations', 'John Smith', 'Guides', 4.8, true, NOW(), NOW()),
    (uuid_generate_v4(), 'Water Purification Methods', 'Video', 'Tutorial on different water purification techniques', 'Sarah Johnson', 'Water', 4.5, false, NOW(), NOW()),
    (uuid_generate_v4(), 'Basic First Aid Manual', 'Document', 'Essential first aid procedures and techniques', 'Dr. Michael Brown', 'Medical', 4.9, true, NOW(), NOW()),
    (uuid_generate_v4(), 'Food Storage Basics', 'Article', 'Tips for long-term food storage', 'Emily Wilson', 'Food', 4.2, false, NOW(), NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category); 