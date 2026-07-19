'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, Star, Quote, BookOpen, FileText, ExternalLink, Hash } from 'lucide-react'
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

  const getIconForCategory = (category) => {
    const cat = category?.toLowerCase() || 'book'
    if (cat.includes('book')) return <BookOpen size={18} className="text-white" />
    if (cat.includes('article') || cat.includes('essay')) return <FileText size={18} className="text-white" />
    return <Hash size={18} className="text-white" />
  }

  const getColorForCategory = (category) => {
    const cat = category?.toLowerCase() || 'book'
    if (cat.includes('book')) return 'from-indigo-500 to-purple-600'
    if (cat.includes('article')) return 'from-emerald-400 to-teal-500'
    if (cat.includes('essay')) return 'from-orange-400 to-red-500'
    return 'from-neutral-500 to-neutral-700'
  }

  return (
    <main className="min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 25, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-200 dark:bg-emerald-900 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32 pt-24">
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#111] dark:text-white mb-6">
            READING ROOM.
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
            Books, articles, papers, and essays that have influenced my thinking.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 md:left-8 top-10 bottom-10 w-1 bg-neutral-100 dark:bg-neutral-900 rounded-full" />
          
          <div className="space-y-16">
            {loading ? (
              <div className="flex justify-center py-20 text-neutral-400 pl-24">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : libraryData.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 font-medium pl-24">
                The reading room is currently empty.
              </div>
            ) : (
              libraryData.map((item, index) => {
                const color = getColorForCategory(item.category)
                const icon = getIconForCategory(item.category)
                
                const CardWrapper = ({ children }) => {
                  if (item.link) {
                    return (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                        {children}
                      </a>
                    )
                  }
                  return <div className="block group">{children}</div>
                }
                
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="relative pl-12 md:pl-24"
                  >
                    <div className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full z-10 shadow-lg ring-4 ring-white dark:ring-[#0a0a0a]" />
                    <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-8 md:w-16 h-1 bg-neutral-100 dark:bg-neutral-900" />

                    <CardWrapper>
                      <div className="bg-white dark:bg-[#111] p-6 md:p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.03)] border border-neutral-100 dark:border-neutral-800 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row gap-8">
                        
                        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 bg-gradient-to-br ${color} rounded-xl shadow-md`}>
                              {icon}
                            </div>
                            <span className="text-xs font-black text-black dark:text-white uppercase tracking-widest">
                              {item.category || 'Book'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {item.rating && (
                              <div className="flex items-center gap-1 text-yellow-500">
                                {[...Array(item.rating)].map((_, i) => (
                                  <Star key={i} size={14} fill="currentColor" />
                                ))}
                              </div>
                            )}
                            <span className="text-sm text-neutral-400 font-bold">
                              {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-black text-[#111] dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-neutral-500 dark:group-hover:from-white dark:group-hover:to-neutral-400 transition-all relative z-10 inline-flex items-center gap-3">
                          {item.title}
                          {item.link && <ExternalLink size={20} className="text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors" />}
                        </h3>
                        
                        {item.author && (
                          <div className="text-base font-bold text-neutral-400 dark:text-neutral-500 mb-6 relative z-10 uppercase tracking-widest">
                            BY {item.author}
                          </div>
                        )}

                        {item.why_it_mattered && (
                          <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans relative z-10 mb-6">
                            <span className="font-bold text-[#111] dark:text-neutral-300">Why it mattered: </span>
                            {item.why_it_mattered}
                          </p>
                        )}

                        {item.favourite_quote && (
                          <div className="p-6 bg-neutral-50/80 dark:bg-black/20 backdrop-blur-sm border-l-2 border-neutral-300 dark:border-neutral-700 rounded-r-2xl text-neutral-600 dark:text-neutral-400 font-serif italic relative z-10 mt-6 group-hover:border-neutral-800 dark:group-hover:border-neutral-200 transition-colors">
                            <Quote className="absolute top-4 right-4 text-neutral-200 dark:text-neutral-800 opacity-50" size={48} />
                            "{item.favourite_quote}"
                          </div>
                        )}
                      </div>
                    </CardWrapper>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
