import HomeClient from '@/components/HomeClient'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  const { data: notices } = await supabase.from('daily_notices').select('*').order('date', { ascending: false }).limit(1)
  
  const { data: obs } = await supabase.from('posts').select('id, title, slug, content_story, created_at, type').eq('type', 'observation').eq('published', true).order('created_at', { ascending: false }).limit(1)
  
  const { data: continueRead } = await supabase.from('posts').select('id, title, slug, content_story, created_at, type').eq('type', 'observation').eq('published', true).order('created_at', { ascending: false }).range(1, 1)

  const { data: project } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(1)

  const { data: note } = await supabase.from('posts').select('id, title, slug, content_story, created_at, type, notebook_type').eq('type', 'notebook').eq('published', true).order('created_at', { ascending: false }).limit(1)

  return <HomeClient 
    notice={notices?.[0]} 
    latestObservation={obs?.[0]} 
    continueReading={continueRead?.[0]} 
    featuredProject={project?.[0]}
    latestNotebook={note?.[0]}
  />
}
