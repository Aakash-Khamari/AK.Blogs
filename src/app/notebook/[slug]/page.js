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
  const [loading, setLoading] = useState(true)

  // Reading progress
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
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
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-4 text-sm text-neutral-500 font-bold uppercase tracking-widest">
              <span>{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{entry.category || 'Thought'}</span>
            </div>
            <SaveButton postSlug={entry.slug} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-12 text-[#111]">
            {entry.title}
          </h1>
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
      <div className="max-w-5xl mx-auto px-6 space-y-12 text-[1.2rem] text-[#333] leading-[1.9] font-medium">
        
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-black prose-p:leading-[1.8] prose-p:mb-6 drop-cap font-serif">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {entry.content || ""}
            </ReactMarkdown>
          </div>
        </motion.section>

        {/* Discussion Section */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
          <DiscussionBoard prompt={entry.discussion_prompt || "What are your thoughts?"} postSlug={entry.slug} />
        </motion.section>

      </div>
    </main>
    </>
  )
}

