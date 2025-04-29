-- BACKUP POINT: This migration represents a stable state of the database schema and data
-- If you need to reset to this point, you can delete all later migrations and run `npx supabase db reset`

-- Note: This is a marker migration. All schema and data changes are handled by previous migrations:
-- 1. 20250401175809_initial_schema.sql - Base schema with tables and RLS
-- 2. 20250401250001_add_user_location.sql - Empty (user fields in initial schema)
-- 3. 20250401250002_add_avatar_storage.sql - Storage setup for avatars
-- 4. 20250401250003_add_delete_user_function.sql - User deletion function
-- 5. 20250401250004_update_initial_data.sql - Mock data for tracts/inventory/resources
-- 6. 20250401250005_fix_tract_members_policies.sql - Fixed RLS policies

-- Current Schema State:
-- Tables:
--   - users (with avatar_url, location fields)
--   - inventory
--   - resources
--   - tracts
--   - tract_members

-- Features:
--   - Avatar storage bucket and policies
--   - Fixed RLS policies for tracts and tract_members
--   - Mock data for testing
--   - User management functions

-- To reset to this point:
-- 1. Delete any migration files after this one
-- 2. Run: npx supabase db reset 