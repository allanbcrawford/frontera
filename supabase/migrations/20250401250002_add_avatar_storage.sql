-- Enable storage
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create storage policy to allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  POSITION('avatars/' IN name) = 1 AND
  POSITION(auth.uid()::text IN SUBSTRING(name FROM 9)) = 1
);

-- Create storage policy to allow public to view avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Create storage policy to allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  POSITION('avatars/' IN name) = 1 AND
  POSITION(auth.uid()::text IN SUBSTRING(name FROM 9)) = 1
)
WITH CHECK (
  bucket_id = 'avatars' AND
  POSITION('avatars/' IN name) = 1 AND
  POSITION(auth.uid()::text IN SUBSTRING(name FROM 9)) = 1
);

-- Create storage policy to allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  POSITION('avatars/' IN name) = 1 AND
  POSITION(auth.uid()::text IN SUBSTRING(name FROM 9)) = 1
); 