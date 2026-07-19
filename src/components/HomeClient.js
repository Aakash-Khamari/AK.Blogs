'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Activity, Zap, Search } from 'lucide-react'
import Newsletter from '@/components/Newsletter'

export default function HomeClient({ posts }) {
  // Mapping categories to icons and colors dynamically
  const getIconForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'finance': return <Zap size={18} className="text-white" />
      case 'design': return <Activity size={18} className="text-white" />
      case 'technology': return <Search size={18} className="text-white" />
      default: return <Activity size={18} className="text-white" />
    }
  }

  const getColorForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'finance': return 'from-orange-500 to-red-500'
      case 'design': return 'from-blue-500 to-cyan-500'
      case 'technology': return 'from-purple-500 to-pink-500'
      default: return 'from-neutral-500 to-neutral-700'
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200 dark:bg-purple-900 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-100 dark:bg-orange-900/40 rounded-full blur-[150px]"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center pointer-events-none px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center w-full max-w-6xl mx-auto flex flex-col items-center"
        >
          <div className="mb-8 pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-lg text-xs font-bold tracking-widest uppercase text-black">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            I am Aakash Khamari
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#111] dark:text-white mb-8 leading-[0.95] drop-shadow-sm mix-blend-overlay">
            SOME STORIES DESERVE MORE THAN <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-purple-600">3,000 CHARACTERS.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 font-medium max-w-2xl mx-auto bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
            Some ideas deserve more than a news feed. This is my lifelong archive of stories and ideas.
          </p>
        </motion.div>
      </div>

      {/* Split Content Section */}
      <div className="relative z-20 w-full bg-white rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row gap-20">
          
          {/* Left Side: Sticky Text */}
          <div className="lg:w-1/3 relative">
            <div className="sticky top-32">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 text-[#111] dark:text-white leading-[1.1]">
                An archive of observations.
              </h2>
              <p className="text-neutral-500 text-lg leading-relaxed mb-8 font-medium">
                LinkedIn is where conversations begin. My website is where they continue. Every observation starts with a real moment, then asks a bigger question.
              </p>
              <div className="text-sm font-bold text-black uppercase tracking-widest border-b-2 border-black inline-block pb-1">
                Explore the Archive
              </div>
            </div>
          </div>

          {/* Right Side: The "Roadmap" / Node Diagram */}
          <div className="lg:w-2/3 relative">
            {/* Vertical connecting line */}
            <div className="absolute left-8 top-10 bottom-10 w-1 bg-neutral-100 rounded-full" />
            
            <div className="space-y-16">
              {posts && posts.length > 0 ? (
                posts.map((story, index) => {
                  const color = getColorForCategory(story.category)
                  const icon = getIconForCategory(story.category)
                  return (
                    <motion.div 
                      key={story.id}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 100 }}
                      className="relative pl-24"
                    >
                      <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br ${color} rounded-full z-10 shadow-lg`} />
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-1 bg-neutral-100" />

                      <Link href={`/${story.type === 'notebook' ? 'notebook' : 'observations'}/${story.slug}`}>
                        <div className="bg-white p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-neutral-100 group hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer relative overflow-hidden">
                          
                          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                          <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 bg-gradient-to-br ${color} rounded-xl shadow-md`}>
                                {icon}
                              </div>
                              <span className="text-xs font-black text-black uppercase tracking-widest">{story.category || 'Observation'}</span>
                            </div>
                            <span className="text-sm text-neutral-400 font-bold">
                              {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          
                          <h3 className="text-3xl font-black text-[#111] mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-neutral-500 transition-all relative z-10">
                            {story.title}
                          </h3>
                          
                          <div className="mt-8 flex items-center text-sm font-black text-neutral-400 group-hover:text-black transition-colors relative z-10 uppercase tracking-widest">
                            Open Entry
                            <ArrowRight size={18} className="ml-3 transform group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-neutral-500 font-medium pl-24 pt-10">
                  No observations recorded yet. The archive is waiting.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="max-w-6xl mx-auto px-6 py-20 border-t border-neutral-100">
          <Newsletter />
        </div>
      </div>
    </main>
  )
}
