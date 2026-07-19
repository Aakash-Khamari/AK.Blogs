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

export default function StoryPage() {
  const { slug } = useParams()
  const [story, setStory] = useState(null)
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
    const fetchStory = async () => {
      if (!slug) return
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'observation')
        .single()
      
      if (data) {
        setStory(data)
        
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

    fetchStory()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-neutral-400" size={48} />
      </main>
    )
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-black text-[#111] mb-4">Observation Not Found</h1>
        <Link href="/observations" className="text-indigo-600 font-bold hover:underline">
          Return to Observations
        </Link>
      </main>
    )
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      <main className="min-h-screen pb-32">
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-neutral-500 font-bold uppercase tracking-widest">
                Originally Published: {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              {story.last_updated && (
                <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                  Last Updated: {new Date(story.last_updated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
            <SaveButton postSlug={story.slug} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-6 text-[#111] dark:text-white">
            {story.title}
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
        {story.cover_image_url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full aspect-[21/9] md:aspect-[2/1] rounded-[2rem] overflow-hidden shadow-sm border border-neutral-200 bg-neutral-100"
          >
            <Zoom>
              <img src={story.cover_image_url} alt="Cover" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('hidden') }} />
            </Zoom>
          </motion.div>
        )}
      </div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-6 space-y-12 text-[1.15rem] text-[#333] leading-[1.8] font-medium">
        
        {/* The Story */}
        {(story.content_story || story.content) && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-red-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">The Observation</h2>
            </div>
            <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-black prose-p:leading-[1.8] prose-p:mb-6 drop-cap font-serif">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {story.content_story || story.content}
              </ReactMarkdown>
            </div>
          </motion.section>
        )}

        {/* My Reflection */}
        {story.content_reflection && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-6 mt-12">
              <div className="w-8 h-1 bg-blue-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">My Reflection</h2>
            </div>
            <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-black prose-p:leading-[1.8] prose-p:mb-6 font-serif">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {story.content_reflection}
              </ReactMarkdown>
            </div>
          </motion.section>
        )}

        {/* The Bigger Picture */}
        {story.content_picture && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
             <div className="flex items-center gap-4 mb-6 mt-12">
              <div className="w-8 h-1 bg-orange-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">The Bigger Picture</h2>
            </div>
            <div className="p-8 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
              <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-black prose-p:leading-[1.8] font-serif">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {story.content_picture}
                </ReactMarkdown>
              </div>
            </div>
          </motion.section>
        )}

        {/* Questions Worth Thinking About */}
        {story.content_questions && story.content_questions.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
             <div className="flex items-center gap-4 mb-6 mt-12">
              <div className="w-8 h-1 bg-purple-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">Questions to Consider</h2>
            </div>
            <ul className="space-y-4 list-none p-0">
              {story.content_questions.map((q, i) => (
                <li key={i} className="flex gap-4 items-start bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <span className="text-purple-500 font-black text-xl leading-none mt-1">Q.</span>
                  <span className="text-[#111] dark:text-white font-bold">{q}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Behind the Story */}
        {story.content_behind && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 mt-16">
              <h2 className="text-xs font-black tracking-widest text-green-500 uppercase mb-4 text-center">Behind the Observation</h2>
              <div className="text-neutral-500 text-center max-w-lg mx-auto italic text-base font-serif">
                {story.content_behind.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.section>
        )}

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
            <DiscussionBoard prompt={story.content_questions && story.content_questions[0] ? story.content_questions[0] : story.discussion_prompt || "Share your perspective on this observation."} postSlug={story.slug} />
          </div>
        </motion.section>

      </div>
    </main>
    </>
  )
}
