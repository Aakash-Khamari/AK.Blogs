'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import DiscussionBoard from '@/components/DiscussionBoard'
import SaveButton from '@/components/SaveButton'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function NotebookPage() {
  const { slug } = useParams()
  const [entry, setEntry] = useState(null)
  const [themes, setThemes] = useState([])
  const [continueReading, setContinueReading] = useState([])
  const [loading, setLoading] = useState(true)

  // Reading progress
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const fetchEntry = async () => {
      if (!slug) return
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'notebook')
        .single()
      
      if (data) {
        setEntry(data)
        
        // Fetch themes
        const { data: ptData } = await supabase
          .from('post_themes')
          .select('theme_id')
          .eq('post_id', data.id)
          
        if (ptData && ptData.length > 0) {
          const themeIds = ptData.map(pt => pt.theme_id)
          const { data: themesData } = await supabase
            .from('themes')
            .select('*')
            .in('id', themeIds)
          setThemes(themesData || [])
        } else {
          setThemes([])
        }

        // Fetch Next Articles for "Continue Reading"
        const { data: nextPosts } = await supabase
          .from('posts')
          .select('title, slug, type')
          .eq('published', true)
          .neq('id', data.id)
          .limit(3)
        setContinueReading(nextPosts || [])

        // Increment views
        await supabase.rpc('increment_post_views', { post_id: data.id })
      }
      setLoading(false)
    }

    fetchEntry()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-neutral-400" size={48} />
      </main>
    )
  }

  if (!entry) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-black text-[#111] mb-4">Notebook Entry Not Found</h1>
        <Link href="/notebook" className="text-indigo-600 font-bold hover:underline">
          Return to Notebook
        </Link>
      </main>
    )
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      <main className="min-h-screen pb-32">
        {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-12 pb-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-2">
                Originally Published: {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {entry.notebook_type && (
                  <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 text-[10px] rounded-sm">
                    {entry.notebook_type}
                  </span>
                )}
              </div>
              {entry.last_updated && (
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                  Last Updated: {new Date(entry.last_updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
            <SaveButton postSlug={entry.slug} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6 text-[#111] dark:text-white">
            {entry.title}
          </h1>
          
          {themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {themes.map(t => (
                <Link key={t.id} href={`/themes/${t.slug}`} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                  {t.name}
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Cover Image */}
        {entry.cover_image_url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-sm border border-neutral-200 bg-neutral-100"
          >
            <Zoom>
              <img src={entry.cover_image_url} alt="Cover" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('hidden') }} />
            </Zoom>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-12 text-[1.1rem] md:text-[1.2rem] text-[#333] dark:text-neutral-300 leading-[1.9] font-medium">
        
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-[1.8] prose-p:mb-6 drop-cap font-serif whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {entry.content || ""}
            </ReactMarkdown>
          </div>
        </motion.section>

        {/* Continue Reading */}
        {continueReading.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 mt-16">
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase mb-8 text-center">Continue Reading</h2>
              <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto font-serif">
                {continueReading.map((next, idx) => (
                  <div key={next.slug} className="flex flex-col items-center">
                    <Link href={`/${next.type === 'notebook' ? 'notebook' : 'observations'}/${next.slug}`} className="text-xl text-[#111] dark:text-white hover:text-red-500 transition-colors">
                      {next.title}
                    </Link>
                    {idx < continueReading.length - 1 && <span className="text-neutral-300 dark:text-neutral-700 my-4">↓</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
        
        {/* Discussion Section */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 mt-16">
            <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase mb-8 text-center">Reader Perspectives</h2>
            <DiscussionBoard prompt={entry.discussion_prompt || "Share your perspective on this entry."} postSlug={entry.slug} />
          </div>
        </motion.section>

      </div>
    </main>
    </>
  )
}

