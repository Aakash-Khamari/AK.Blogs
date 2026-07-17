import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  // To delete a user from auth.users, we MUST use the Service Role Key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. Cannot delete user from auth.users.' },
      { status: 500 }
    )
  }

  // Initialize Supabase Admin Client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id)
    
    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully.' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
