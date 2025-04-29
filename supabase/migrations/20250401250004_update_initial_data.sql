-- First, clean up any existing data
TRUNCATE TABLE tracts CASCADE;
TRUNCATE TABLE inventory CASCADE;
TRUNCATE TABLE resources CASCADE;

-- Insert initial data for tracts
INSERT INTO tracts (id, name, description, tags, member_count, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'Urban Preppers', 'Preparing for emergencies in urban environments', ARRAY['urban', 'emergency', 'community'], 150, NOW(), NOW()),
  (uuid_generate_v4(), 'Rural Homesteaders', 'Self-sufficiency and sustainable living', ARRAY['rural', 'farming', 'sustainability'], 75, NOW(), NOW()),
  (uuid_generate_v4(), 'Mountain Survival', 'High-altitude survival techniques', ARRAY['mountain', 'wilderness', 'survival'], 45, NOW(), NOW()),
  (uuid_generate_v4(), 'Coastal Defense', 'Coastal area emergency preparedness', ARRAY['coastal', 'marine', 'weather'], 90, NOW(), NOW());

-- Insert initial data for inventory
INSERT INTO inventory (id, name, category, quantity, unit, expiry_date, location, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'Emergency Water', 'Water', 100, 'gallons', '2025-12-31', 'Storage Room A', NOW(), NOW()),
  (uuid_generate_v4(), 'Canned Food', 'Food', 200, 'cans', '2026-06-30', 'Pantry B', NOW(), NOW()),
  (uuid_generate_v4(), 'First Aid Kit', 'Medical', 10, 'kits', '2027-01-15', 'Medical Cabinet', NOW(), NOW()),
  (uuid_generate_v4(), 'Solar Panels', 'Energy', 5, 'panels', NULL, 'Equipment Room', NOW(), NOW()),
  (uuid_generate_v4(), 'Emergency Radio', 'Communication', 15, 'units', NULL, 'Command Center', NOW(), NOW());

-- Insert initial data for resources
INSERT INTO resources (id, title, type, description, author, category, rating, bookmarked, created_at, updated_at)
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
CREATE INDEX IF NOT EXISTS idx_resources_rating ON resources (rating); 