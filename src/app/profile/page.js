'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Bookmark, User as UserIcon } from 'lucide-react'

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
        email: user.email // Explicitly ensure email is extracted from auth.user
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
      <div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center">
        <div className="animate-pulse flex gap-2">
          <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
          <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
          <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <h1 className="text-4xl font-black tracking-tighter text-[#111]">
            Your <span className="text-indigo-600">Profile</span>
          </h1>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-red-600 transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Profile Details */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm mb-12 flex items-center gap-6">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111] mb-1">
              {profile?.display_name || 'Observer'}
            </h2>
            <p className="text-neutral-500 font-medium">{profile?.email}</p>
            <div className="mt-3 inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full">
              {profile?.role === 'admin' ? 'Director' : 'Observer'}
            </div>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-xl font-bold text-[#111] mb-6 flex items-center gap-2">
            <Bookmark size={20} className="text-indigo-600" />
            Saved Collections
          </h3>
          
          {collections.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-neutral-100 shadow-sm text-center">
              <p className="text-neutral-500 font-medium">You haven't saved any stories or ideas yet.</p>
              <Link href="/library" className="text-indigo-600 font-bold mt-2 inline-block hover:underline">
                Explore the Library
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {collections.map((item) => (
                <Link key={item.id} href={`/stories/${item.post_slug}`}>
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex justify-between items-center group"
                  >
                    <div>
                      <h4 className="font-bold text-[#111] group-hover:text-indigo-600 transition">
                        {/* We would ideally fetch the actual title by joining a posts table, but since we rely on static data right now, we just show the slug styled nicely */}
                        {item.post_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-neutral-400 mt-1">Saved on {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <ArrowRightIcon className="text-neutral-300 group-hover:text-indigo-600 transition transform group-hover:translate-x-1" />
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}

function ArrowRightIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
