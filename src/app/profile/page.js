'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, ArrowRight, Bookmark, Flame, History } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push('/login')
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile({ 
        ...user, 
        ...profileData,
        email: user.email
      })

      // Fetch collections
      const { data: collectionsData } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setCollections(collectionsData || [])
      setLoading(false)
    }

    fetchProfileData()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
          <div className="w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
          <div className="w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-16 border-b border-neutral-100 dark:border-neutral-900 pb-8">
          <div>
            <h1 className="text-3xl font-serif tracking-tight text-[#111] dark:text-white mb-2">
              {profile?.display_name || 'Observer'}
            </h1>
            <p className="text-sm text-neutral-500 font-sans">{profile?.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Main Content: Saved & History */}
          <div className="md:col-span-2 space-y-16">
            
            <section>
              <div className="flex items-center gap-3 mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400">
                <Bookmark size={14} /> Saved
              </div>
              
              {collections.length === 0 ? (
                <div className="py-8 text-neutral-500 font-medium text-sm">
                  You haven't saved any stories or ideas yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {collections.map((item) => (
                    <Link key={item.id} href={`/observations/${item.post_slug}`} className="group block">
                      <h4 className="text-lg font-serif text-[#111] dark:text-white group-hover:text-red-500 transition-colors">
                        {item.post_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-bold">
                        Saved on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <div className="w-full h-px bg-neutral-100 dark:bg-neutral-900"></div>

            <section>
              <div className="flex items-center gap-3 mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400">
                <History size={14} /> Reading History
              </div>
              <div className="py-8 text-neutral-500 font-medium text-sm">
                Reading history tracking is currently paused.
              </div>
            </section>

          </div>

          {/* Sidebar: Streak */}
          <div className="md:col-span-1">
            <div className="p-6 border border-neutral-100 dark:border-neutral-900 flex flex-col items-center justify-center text-center gap-3">
              <Flame size={32} className="text-orange-500" />
              <div>
                <h3 className="text-3xl font-serif text-[#111] dark:text-white">3</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">Day Streak</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
