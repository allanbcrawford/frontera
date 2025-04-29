import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/lib/database.types';

type Tract = Database['public']['Tables']['tracts']['Row'];
type Inventory = Database['public']['Tables']['inventory']['Row'];
type DatabaseResource = Database['public']['Tables']['resources']['Row'];
type User = Database['public']['Tables']['users']['Row'];

type Resource = DatabaseResource & {
  added_date: string;
};

// Create a type for inventory item creation that excludes auto-generated fields
type CreateInventoryItem = Omit<Database['public']['Tables']['inventory']['Insert'], 'id' | 'created_at' | 'updated_at' | 'user_id'>;

// User APIs
export const updateUserProfile = async (updates: Partial<User>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Tract APIs
export const getTractsList = async (): Promise<Tract[]> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('tracts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Tract[];
};

export const createTract = async (tract: Omit<Tract, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('tracts')
    .insert([{ ...tract, user_id: user.id }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTract = async (id: string, updates: Partial<Tract>) => {
  const { data, error } = await supabase
    .from('tracts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTract = async (id: string) => {
  const { error } = await supabase
    .from('tracts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Inventory APIs
export const getInventoryList = async (): Promise<Inventory[]> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Inventory[];
};

export const createInventoryItem = async (item: CreateInventoryItem) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('inventory')
    .insert([{ ...item, user_id: user.id }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateInventoryItem = async (id: string, updates: Partial<Inventory>) => {
  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteInventoryItem = async (id: string) => {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Resource APIs
export const getResourcesList = async (): Promise<Resource[]> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data as DatabaseResource[]).map(resource => ({
    ...resource,
    added_date: resource.added_date || resource.created_at
  }));
};

export const createResource = async (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('resources')
    .insert([{ ...resource, user_id: user.id }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateResource = async (id: string, updates: Partial<Resource>) => {
  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteResource = async (id: string) => {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const toggleResourceBookmark = async (id: string, currentValue: boolean) => {
  const { data, error } = await supabase
    .from('resources')
    .update({ bookmarked: !currentValue })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}; 