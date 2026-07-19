'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DailyNoticesIndex() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      const { data, error } = await supabase
        .from('daily_notices')
        .select('*')
        .order('date', { ascending: false })
      
      if (data) {
        setNotices(data)
      }
      setLoading(false)
    }

    fetchNotices()
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-[#111] dark:text-white mb-6 tracking-tight">
          Today I Noticed
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
          One sentence. One observation. Every day.
        </p>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto px-6 space-y-12">
        {loading ? (
          <div className="flex justify-center py-20 text-neutral-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : notices.length > 0 ? (
          notices.map((notice, index) => (
            <motion.div 
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <Link href={`/daily/${notice.permalink || notice.id}`}>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                    {new Date(notice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <h2 className="text-2xl font-serif text-[#111] dark:text-neutral-100 group-hover:text-red-500 transition-colors tracking-tight">
                    "{notice.sentence}"
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-neutral-500 font-medium border-t border-neutral-100 dark:border-neutral-900 pt-8">
            No daily notices recorded yet.
          </div>
        )}
      </div>
    </main>
  )
}
