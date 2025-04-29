import { createClient } from '@supabase/supabase-js'
import type { Database as SchemaDatabase } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient<SchemaDatabase>(supabaseUrl, supabaseAnonKey)

// Database types
export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Inventory = {
  id: string
  user_id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiry_date: string | null
  location: string
  status: string
  created_at: string
  updated_at: string
}

export type Resource = Database['public']['Tables']['resources']['Row'];

export type Tract = {
  id: string
  user_id: string
  name: string
  description: string | null
  tags: string[]
  member_count: number
  location: string | null
  created_at: string
  updated_at: string
}

export type TractMember = {
  id: string
  tract_id: string
  user_id: string
  role: string
  created_at: string
}

// Database schema type
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      inventory: {
        Row: Inventory
        Insert: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Inventory, 'id' | 'created_at' | 'updated_at'>>
      }
      resources: {
        Row: Resource
        Insert: Omit<Resource, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>
      }
      tracts: {
        Row: Tract
        Insert: Omit<Tract, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Tract, 'id' | 'created_at' | 'updated_at'>>
      }
      tract_members: {
        Row: TractMember
        Insert: Omit<TractMember, 'id' | 'created_at'>
        Update: Partial<Omit<TractMember, 'id' | 'created_at'>>
      }
    }
  }
}

// Create a Supabase client for public operations
export const supabaseAdmin = createClient<SchemaDatabase>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper functions for common operations
export const inventoryApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Inventory[]
  },
  create: async (item: Database['public']['Tables']['inventory']['Insert']) => {
    const { data, error } = await supabase
      .from('inventory')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data as Inventory
  },
  update: async (id: string, updates: Database['public']['Tables']['inventory']['Update']) => {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Inventory
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}

export const resourcesApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Resource[]
  },
  create: async (item: Database['public']['Tables']['resources']['Insert']) => {
    const { data, error } = await supabase
      .from('resources')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data as Resource
  },
  update: async (id: string, updates: Database['public']['Tables']['resources']['Update']) => {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Resource
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
  toggleBookmark: async (id: string, bookmarked: boolean) => {
    const { data, error } = await supabase
      .from('resources')
      .update({ bookmarked })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Resource
  }
}

export const tractsApi = {
  list: async () => {
    const { data, error } = await supabase
      .from('tracts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Tract[]
  },
  create: async (item: Database['public']['Tables']['tracts']['Insert']) => {
    const { data, error } = await supabase
      .from('tracts')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data as Tract
  },
  update: async (id: string, updates: Database['public']['Tables']['tracts']['Update']) => {
    const { data, error } = await supabase
      .from('tracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Tract
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('tracts')
      .delete()
      .eq('id', id)
    if (error) throw error
  },
  addMember: async (tractId: string, userId: string, role: string = 'member') => {
    const { data, error } = await supabase
      .from('tract_members')
      .insert({ tract_id: tractId, user_id: userId, role })
      .select()
      .single()
    if (error) throw error
    return data
  },
  removeMember: async (tractId: string, userId: string) => {
    const { error } = await supabase
      .from('tract_members')
      .delete()
      .eq('tract_id', tractId)
      .eq('user_id', userId)
    if (error) throw error
  }
} 