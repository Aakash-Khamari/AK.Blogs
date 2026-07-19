import HomeClient from '@/components/HomeClient'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering to always show the latest posts on the homepage
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  // Fetch the latest published posts (max 5 for the homepage timeline)
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, category, created_at, type')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return <HomeClient posts={posts || []} />
}
