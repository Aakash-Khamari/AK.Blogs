'use client'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function NowPage() {
  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500 font-bold uppercase tracking-widest">
            <Calendar size={18} />
            <span>Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-12 text-[#111]">
            What I'm doing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Now.</span>
          </h1>
          <p className="text-xl text-neutral-500 font-medium mb-16 max-w-2xl">
            This is a /now page. It's a simple way to stay connected to my journey without needing a constant stream of personal updates.
          </p>
        </motion.div>

        <div className="space-y-16 text-[1.15rem] text-[#333] leading-[1.8] font-medium">
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-red-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">What am I building?</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <p>Currently focusing on scaling this digital archive. I am turning my thousands of words and hours of thought into a lifelong repository that isn't dependent on social media algorithms.</p>
            </div>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-blue-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">What am I learning?</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <p>Diving deep into digital psychology, how people interact with interfaces, and the underlying financial mechanisms that govern everyday decisions.</p>
            </div>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-green-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">What am I reading?</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <p>I'm currently exploring essays on structural thinking, cognitive bias, and some foundational books on behavioral economics.</p>
            </div>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-purple-500 rounded-full" />
              <h2 className="text-xs font-black tracking-widest text-neutral-400 uppercase">What am I curious about?</h2>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <p>Why do we trust machines more than people? How does curiosity usually begin with confusion? These are the questions keeping me up.</p>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
