'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function NowPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <div className="mb-6 flex items-center gap-2 text-xs text-neutral-400 font-bold uppercase tracking-widest">
          <Calendar size={14} />
          <span>Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#111] dark:text-white mb-6 tracking-tight">
          Now
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
          What I'm currently focused on, building, and thinking about. A snapshot of my present priorities.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-16 text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
        
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Focus</h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg">
            <p>
              I am currently focused on expanding my understanding of how systems design influences human behavior, particularly in the digital realm. My primary objective is to transition from simply observing trends to actively synthesizing them into structural frameworks.
            </p>
          </div>
        </motion.section>

        <div className="w-full h-px bg-neutral-100 dark:bg-neutral-900"></div>

        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Building</h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg">
            <p>
              I am actively building out this platform—AakashKhamari.com—as a personal knowledge graph. I'm moving away from chronological feeds and instead designing an architecture that encourages deep reading, thematic exploration, and lasting utility.
            </p>
          </div>
        </motion.section>

        <div className="w-full h-px bg-neutral-100 dark:bg-neutral-900"></div>

        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Reading</h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg">
            <p>
              Currently re-reading foundational texts on behavioral economics, mixed with architectural theory. The intersection of how physical spaces dictate movement and how digital spaces dictate attention is a recurring theme in my daily reading.
            </p>
          </div>
        </motion.section>

        <div className="w-full h-px bg-neutral-100 dark:bg-neutral-900"></div>

        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">Works in Progress</h2>
          </div>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg">
            <p>
              Drafting a long-form essay exploring the concept of "Digital Trust" and how micro-interactions (like loaders and haptic feedback) subconsciously shape our perception of security. Also compiling my first "Annual Letter" outlining my observations over the past year.
            </p>
          </div>
        </motion.section>

      </div>
    </main>
  )
}
