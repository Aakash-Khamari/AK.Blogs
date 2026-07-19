'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ReadingRoomIndex() {
  const [libraryData, setLibraryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReadingRoom = async () => {
      const { data, error } = await supabase
        .from('reading_room')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setLibraryData(data)
      }
      setLoading(false)
    }

    fetchReadingRoom()
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-[#111] dark:text-white mb-6 tracking-tight">
          Reading Room
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
          Books, articles, papers, and essays that have influenced my thinking.
        </p>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {loading ? (
          <div className="flex justify-center py-20 text-neutral-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : libraryData.length > 0 ? (
          libraryData.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border-b border-neutral-100 dark:border-neutral-900 pb-16 last:border-0"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                      {item.category || 'Book'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-serif text-[#111] dark:text-neutral-100 tracking-tight">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors underline decoration-neutral-200 dark:decoration-neutral-800 underline-offset-4">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.author && (
                    <div className="text-neutral-500 dark:text-neutral-400 font-sans mt-1">
                      by {item.author}
                    </div>
                  )}
                </div>

                {item.why_it_mattered && (
                  <div className="mt-2 text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    <span className="font-bold text-[#111] dark:text-neutral-300">Why it mattered: </span>
                    {item.why_it_mattered}
                  </div>
                )}

                {item.favourite_quote && (
                  <div className="mt-4 p-6 bg-neutral-50 dark:bg-[#111] border-l-2 border-red-500 rounded-r-2xl text-neutral-600 dark:text-neutral-400 font-serif italic relative">
                    <Quote className="absolute top-4 right-4 text-neutral-200 dark:text-neutral-800 opacity-50" size={48} />
                    "{item.favourite_quote}"
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-neutral-500 font-medium border-t border-neutral-100 dark:border-neutral-900 pt-8">
            The reading room is currently empty.
          </div>
        )}
      </div>
    </main>
  )
}
