'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SaveButton({ postSlug }) {
  const { user } = useAuth()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      checkSavedStatus()
    } else {
      setLoading(false)
    }
  }, [user, postSlug])

  const checkSavedStatus = async () => {
    const { data } = await supabase
      .from('collections')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_slug', postSlug)
      .single()
    
    if (data) {
      setIsSaved(true)
    }
    setLoading(false)
  }

  const toggleSave = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (isSaved) {
      setIsSaved(false)
      await supabase
        .from('collections')
        .delete()
        .eq('user_id', user.id)
        .eq('post_slug', postSlug)
    } else {
      setIsSaved(true)
      await supabase
        .from('collections')
        .insert([{ user_id: user.id, post_slug: postSlug }])
    }
  }

  if (loading) return null

  return (
    <button 
      onClick={toggleSave}
      className={`p-2 rounded-full transition-colors flex items-center justify-center ${isSaved ? 'bg-indigo-100 text-indigo-600' : 'bg-neutral-100 text-neutral-400 hover:text-black hover:bg-neutral-200'}`}
      title={isSaved ? "Remove from Collection" : "Save to Collection"}
    >
      <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
    </button>
  )
}
