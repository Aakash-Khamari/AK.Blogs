import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { post_id } = await request.json()
    
    if (!post_id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Missing service role key' }, { status: 500 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey
    )

    // 1. Get current views
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('views')
      .eq('id', post_id)
      .single()

    if (fetchError) throw fetchError

    // 2. Increment views
    const { error: updateError } = await supabaseAdmin
      .from('posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', post_id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
