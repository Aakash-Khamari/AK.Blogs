'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function ThemesIndex() {
  const [themes, setThemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchThemes = async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name', { ascending: true })
      
      if (data) setThemes(data)
      setLoading(false)
    }
    fetchThemes()
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-[#111] dark:text-white mb-6 tracking-tight">
          Themes
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
          Explore writing organized by the recurring ideas and subjects that shape my thinking.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center py-20 text-neutral-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : themes.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium border-t border-neutral-100 dark:border-neutral-900 pt-8">
            No themes created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map((theme, index) => (
              <motion.div 
                key={theme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/themes/${theme.slug}`}>
                  <div className="p-6 border border-neutral-100 dark:border-neutral-900 hover:border-black dark:hover:border-white transition-colors group">
                    <h2 className="text-lg font-bold text-[#111] dark:text-white group-hover:text-red-500 transition-colors">
                      {theme.name}
                    </h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
