-- Reset tables without affecting auth
TRUNCATE TABLE public.tract_members CASCADE;
TRUNCATE TABLE public.tracts CASCADE;
TRUNCATE TABLE public.inventory CASCADE;
TRUNCATE TABLE public.resources CASCADE;

-- Insert public resources (no user_id required)
INSERT INTO public.resources (id, title, type, description, author, category, rating, bookmarked, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'Emergency Preparedness Guide', 'Document', 'Comprehensive guide for emergency situations', 'John Smith', 'Guides', 4.8, true, NOW(), NOW()),
    (uuid_generate_v4(), 'Water Purification Methods', 'Video', 'Tutorial on different water purification techniques', 'Sarah Johnson', 'Water', 4.5, false, NOW(), NOW()),
    (uuid_generate_v4(), 'Basic First Aid Manual', 'Document', 'Essential first aid procedures and techniques', 'Dr. Michael Brown', 'Medical', 4.9, true, NOW(), NOW()),
    (uuid_generate_v4(), 'Food Storage Basics', 'Article', 'Tips for long-term food storage', 'Emily Wilson', 'Food', 4.2, false, NOW(), NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracts_tags ON tracts USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory (category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category); 