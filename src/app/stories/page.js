'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Zap, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function StoriesIndex() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('type', 'story')
        .eq('published', true)
        .order('created_at', { ascending: false })
      
      if (data) {
        setStories(data)
      }
      setLoading(false)
    }

    fetchStories()
  }, [])

  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-[#111] mb-6">
          Stories from <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Everyday Life.</span>
        </h1>
        <p className="text-xl text-neutral-500 font-medium max-w-2xl">
          Observations turned into narratives. This is where simple moments become deeper explorations of human behavior, technology, and society.
        </p>
      </div>

      {/* List of Stories */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {loading ? (
          <div className="flex justify-center py-20 text-neutral-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium bg-white rounded-3xl border border-neutral-100 shadow-sm">
            No stories published yet.
          </div>
        ) : (
          stories.map((story, index) => (
            <motion.div 
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/stories/${story.slug}`}>
                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-neutral-100 group hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer relative overflow-hidden">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-md`}>
                        <Zap size={18} className="text-white" />
                      </div>
                      <span className="text-xs font-black text-black uppercase tracking-widest">{story.category}</span>
                    </div>
                    <span className="text-sm text-neutral-400 font-bold">
                      {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-[#111] mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-neutral-500 transition-all">
                    {story.title}
                  </h2>

                  <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-4xl line-clamp-2">
                    {story.content_story || story.content || "Read this observation..."}
                  </p>
                  
                  <div className="flex items-center text-sm font-black text-neutral-400 group-hover:text-black transition-colors uppercase tracking-widest">
                    Read the Observation
                    <ArrowRight size={18} className="ml-3 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </main>
  )
}
