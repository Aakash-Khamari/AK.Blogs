'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import DiscussionBoard from '@/components/DiscussionBoard'
import SaveButton from '@/components/SaveButton'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function IdeaPage() {
  const { slug } = useParams()
  const [essay, setEssay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEssay = async () => {
      if (!slug) return
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('type', 'idea')
        .single()
      
      if (data) {
        setEssay(data)
        // Increment views
        await supabase.rpc('increment_post_views', { post_id: data.id })
      }
      setLoading(false)
    }

    fetchEssay()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-neutral-400" size={48} />
      </main>
    )
  }

  if (!essay) {
    return (
      <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-black text-[#111] mb-4">Idea Not Found</h1>
        <Link href="/ideas" className="text-indigo-600 font-bold hover:underline">
          Return to Ideas
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-32">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-4 text-sm text-neutral-500 font-bold uppercase tracking-widest">
              <span>{new Date(essay.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{essay.category}</span>
            </div>
            <SaveButton postSlug={essay.slug} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-12 text-[#111]">
            {essay.title}
          </h1>
        </motion.div>

        {/* Cover Image */}
        {essay.cover_image_url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-sm border border-neutral-200"
          >
            <img src={essay.cover_image_url} alt="Cover" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('hidden') }} />
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 space-y-12 text-[1.2rem] text-[#333] leading-[1.9] font-medium">
        
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
          <div className="space-y-8">
            {(essay.content || "").split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.section>

        {/* Discussion Section */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
          <DiscussionBoard prompt={essay.discussion_prompt || "What are your thoughts?"} postSlug={essay.slug} />
        </motion.section>

      </div>
    </main>
  )
}
