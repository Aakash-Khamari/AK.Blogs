'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, ArrowLeft, ArrowRight, Twitter, Linkedin, Link2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'

export default function SingleDailyNotice() {
  const { slug } = useParams()
  const [notice, setNotice] = useState(null)
  const [prevNotice, setPrevNotice] = useState(null)
  const [nextNotice, setNextNotice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotice = async () => {
      // First try fetching by permalink, fallback to id
      let { data, error } = await supabase
        .from('daily_notices')
        .select('*')
        .eq('permalink', slug)
        .single()
      
      if (!data) {
        const { data: idData } = await supabase
          .from('daily_notices')
          .select('*')
          .eq('id', slug)
          .single()
        data = idData
      }

      if (data) {
        setNotice(data)
        
        // Fetch prev and next for navigation
        const { data: prev } = await supabase
          .from('daily_notices')
          .select('permalink, id')
          .lt('date', data.date)
          .order('date', { ascending: false })
          .limit(1)
          .single()
          
        const { data: next } = await supabase
          .from('daily_notices')
          .select('permalink, id')
          .gt('date', data.date)
          .order('date', { ascending: true })
          .limit(1)
          .single()

        if (prev) setPrevNotice(prev)
        if (next) setNextNotice(next)
      }
      
      setLoading(false)
    }

    fetchNotice()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-serif text-[#111] dark:text-white">Notice not found</h1>
        <Link href="/daily" className="text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Today I Noticed
        </Link>
      </div>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-6 w-full">
        
        <Link href="/daily" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-16">
          <ArrowLeft size={14} className="mr-2" />
          All Notices
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-sm font-bold uppercase tracking-widest text-red-500 mb-8">
            {new Date(notice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#111] dark:text-white leading-tight tracking-tight mb-16">
            "{notice.sentence}"
          </h1>
          
          <div className="flex items-center justify-center gap-6 border-t border-neutral-100 dark:border-neutral-900 pt-8">
            <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="text-neutral-400 hover:text-[#111] dark:hover:text-white transition-colors" title="Copy Link">
              <Link2 size={20} />
            </button>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${notice.sentence}"\n\n`)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#111] dark:hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#111] dark:hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-24 flex items-center justify-between">
          {prevNotice ? (
            <Link href={`/daily/${prevNotice.permalink || prevNotice.id}`} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-[#111] dark:hover:text-white transition-colors">
              <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
              Previous
            </Link>
          ) : <div />}
          
          {nextNotice ? (
            <Link href={`/daily/${nextNotice.permalink || nextNotice.id}`} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-[#111] dark:hover:text-white transition-colors">
              Next
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>

      </div>
    </main>
  )
}
