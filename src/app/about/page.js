'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, PenTool, Layout } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12">
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
        
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8 text-[#111]">
            I am Aakash Khamari. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Thinker. Observer. Builder.</span>
          </h1>
          <p className="text-2xl text-neutral-500 font-medium max-w-3xl leading-relaxed">
            I spent the last year posting on LinkedIn. Some posts did well. Some disappeared. But one thing became clear: stories deserve a longer life than an algorithm gives them. 
          </p>
        </motion.div>

        {/* Portfolio / Story Section */}
        <div className="space-y-24 text-[1.2rem] text-[#333] leading-[1.9] font-medium">
          
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                <div className="sticky top-32">
                  <div className="w-12 h-1 bg-red-500 rounded-full mb-6" />
                  <h2 className="text-3xl font-black text-[#111]">The Vision</h2>
                </div>
              </div>
              <div className="md:w-2/3 space-y-6">
                <p>Every LinkedIn post has an expiration date. That's always bothered me.</p>
                <p>Over the past year, I've written stories about people, technology, finance, leadership, and unexpected encounters. Once a post disappears from the feed, it's almost impossible to discover again. Thousands of words. Hours of thought. Gone beneath the algorithm.</p>
                <p>I didn't want a blog. I didn't want a standard portfolio. I wanted a place where every observation could continue growing.</p>
              </div>
            </div>
          </motion.section>

          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                <div className="sticky top-32">
                  <div className="w-12 h-1 bg-blue-500 rounded-full mb-6" />
                  <h2 className="text-3xl font-black text-[#111]">My Work</h2>
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="grid gap-6">
                  {/* Portfolio Card 1 */}
                  <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center gap-4 mb-4 text-blue-500">
                      <BookOpen size={24} />
                      <span className="font-black tracking-widest uppercase text-xs text-neutral-400">Writer & Thinker</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#111] mb-2 group-hover:text-blue-500 transition-colors">The Archive of Observations</h3>
                    <p className="text-neutral-500 text-lg mb-6">Building a permanent digital home for structural thinking, financial literacy, and psychological essays.</p>
                    <Link href="/observations" className="text-sm font-black uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors flex items-center">
                      Read Observations <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>

                  {/* Portfolio Card 2 */}
                  <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-center gap-4 mb-4 text-orange-500">
                      <PenTool size={24} />
                      <span className="font-black tracking-widest uppercase text-xs text-neutral-400">Curator</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#111] mb-2 group-hover:text-orange-500 transition-colors">The Notebook</h3>
                    <p className="text-neutral-500 text-lg mb-6">Documenting unfinished thoughts, tiny observations, and questions about human behavior.</p>
                    <Link href="/notebook" className="text-sm font-black uppercase tracking-widest text-neutral-400 group-hover:text-black transition-colors flex items-center">
                      Open Notebook <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </main>
  )
}
