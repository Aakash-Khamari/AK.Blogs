'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'

export default function ThemePage() {
  const params = useParams()
  const [theme, setTheme] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchThemeAndPosts = async () => {
      // Fetch Theme
      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('*')
        .eq('slug', params.slug)
        .single()
      
      if (themeData) {
        setTheme(themeData)
        
        // Fetch posts linked to this theme
        const { data: ptData } = await supabase
          .from('post_themes')
          .select('post_id')
          .eq('theme_id', themeData.id)
          
        if (ptData && ptData.length > 0) {
          const postIds = ptData.map(pt => pt.post_id)
          
          const { data: postsData } = await supabase
            .from('posts')
            .select('*')
            .in('id', postIds)
            .eq('published', true)
            .order('created_at', { ascending: false })
            
          if (postsData) setPosts(postsData)
        }
      }
      setLoading(false)
    }

    if (params.slug) {
      fetchThemeAndPosts()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    )
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-serif text-[#111] dark:text-white">Theme not found</h1>
        <Link href="/themes" className="text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Themes
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <Link href="/themes" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-8">
          <ArrowLeft size={14} className="mr-2" />
          All Themes
        </Link>
        <h1 className="text-4xl md:text-5xl font-serif text-[#111] dark:text-white mb-6 tracking-tight">
          {theme.name}
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
          {posts.length} {posts.length === 1 ? 'idea' : 'ideas'} exploring this theme.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium border-t border-neutral-100 dark:border-neutral-900 pt-8">
            No writing found for this theme.
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <Link href={post.type === 'observation' ? `/observations/${post.slug}` : `/notebook/${post.slug}`}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                      {post.type === 'observation' ? 'Observation' : 'Notebook'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-serif text-[#111] dark:text-neutral-100 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors tracking-tight">
                    {post.title}
                  </h2>

                  <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 font-sans mt-2">
                    {post.content_story || post.content || "Read more..."}
                  </p>
                  
                  <div className="flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors mt-4">
                    Read {post.type === 'observation' ? 'Observation' : 'Entry'}
                    <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
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
