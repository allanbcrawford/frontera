import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
)

async function deleteUser() {
  const userId = '4d49fbc2-3bc3-45ac-b997-728d1465002b'
  
  try {
    // Delete from public tables first
    console.log('Deleting user data from public tables...')
    
    const { error: inventoryError } = await supabase
      .from('inventory')
      .delete()
      .eq('user_id', userId)
    if (inventoryError) console.error('Error deleting inventory:', inventoryError.message)
    
    const { error: tractsError } = await supabase
      .from('tracts')
      .delete()
      .eq('user_id', userId)
    if (tractsError) console.error('Error deleting tracts:', tractsError.message)
    
    const { error: resourcesError } = await supabase
      .from('resources')
      .delete()
      .eq('user_id', userId)
    if (resourcesError) console.error('Error deleting resources:', resourcesError.message)
    
    const { error: usersError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    if (usersError) console.error('Error deleting from users table:', usersError.message)
    
    console.log('Deleting user from auth.users...')
    // Now try to delete from auth.users
    const { error: authError } = await supabase.rpc('delete_user', {
      userid: userId
    })
    
    if (authError) {
      console.error('Error deleting from auth.users:', authError.message)
      return
    }
    
    console.log('User deleted successfully')
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

deleteUser() 