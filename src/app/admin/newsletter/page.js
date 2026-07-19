import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewsletterEditor from './NewsletterEditor'

export default async function AdminNewsletter() {
  const supabase = await createClient()
  
  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  // Get subscriber count
  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#111] dark:text-white mb-2">Newsletter</h1>
        <p className="text-neutral-500 font-medium">Compose and broadcast your newsletter to {count || 0} subscribers.</p>
      </div>

      <NewsletterEditor subscriberCount={count || 0} />
    </div>
  )
}
