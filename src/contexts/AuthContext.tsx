import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, supabaseAdmin } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Extract username from email (everything before @)
      const baseUsername = email.split('@')[0].toLowerCase()
      
      // Create the auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('No user data returned')

      // Try to create public user with base username first
      const { error: publicError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email || email,
          username: baseUsername,
          full_name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (publicError?.code === '23505' && publicError.message.includes('users_username_key')) {
        // Username exists, try with a random suffix
        const suffix = Math.floor(Math.random() * 10000)
        const { error: retryError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email || email,
            username: `${baseUsername}${suffix}`,
            full_name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (retryError) {
          console.error('Error creating public user with suffix:', retryError)
          await supabase.auth.signOut()
          throw new Error('Failed to create user profile')
        }
      } else if (publicError) {
        console.error('Error creating public user:', publicError)
        await supabase.auth.signOut()
        throw new Error('Failed to create user profile')
      }
    } catch (error) {
      // Clean up and rethrow with a user-friendly message
      await supabase.auth.signOut()
      if (error instanceof Error) {
        throw new Error(
          error.message.includes('User already registered') 
            ? 'An account with this email already exists' 
            : 'Failed to create account. Please try again.'
        )
      }
      throw new Error('Failed to create account. Please try again.')
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 