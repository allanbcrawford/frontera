-- Insert mock data for tracts
INSERT INTO tracts (id, name, description, tags, user_id, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'Urban Preppers Network', 'A community focused on urban preparedness strategies', ARRAY['urban', 'community', 'preparedness'], NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Sustainable Living Group', 'Discussion and resources for sustainable living practices', ARRAY['sustainable', 'eco-friendly', 'lifestyle'], NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Emergency Response Team', 'Coordination and training for emergency response', ARRAY['emergency', 'response', 'training'], NULL, NOW(), NOW());

-- Insert mock data for inventory (these will be public/example items)
INSERT INTO inventory (id, name, category, quantity, unit, description, location, expiry_date, user_id, created_at, updated_at)
VALUES
    (uuid_generate_v4(), 'First Aid Kit', 'Medical', 1, 'kit', 'Basic emergency medical supplies', 'Medical Cabinet', NOW() + INTERVAL '1 year', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Water Storage Container', 'Water', 2, 'containers', '5-gallon containers for water storage', 'Storage Room', NULL, NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Emergency Food Supply', 'Food', 10, 'packets', 'Long-term storage food packets', 'Pantry', NOW() + INTERVAL '2 years', NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Solar Power Bank', 'Equipment', 1, 'unit', 'Portable solar charger for devices', 'Equipment Room', NULL, NULL, NOW(), NOW()),
    (uuid_generate_v4(), 'Emergency Radio', 'Communication', 1, 'unit', 'Hand-crank emergency radio with NOAA', 'Command Center', NULL, NULL, NOW(), NOW());

-- Insert some tract members for the mock tracts
INSERT INTO tract_members (id, tract_id, user_id, role, created_at)
SELECT 
    uuid_generate_v4(),
    t.id,
    NULL,
    'member',
    NOW()
FROM tracts t; 