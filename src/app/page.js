'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Activity, Zap, Search } from 'lucide-react'
import Newsletter from '@/components/Newsletter'

const stories = [
  {
    id: 1,
    title: "The ₹500 Withdrawal That Made Me Think About India's Financial Journey",
    slug: 'the-500-rupee-withdrawal',
    date: 'July 17, 2026',
    category: 'Finance',
    icon: <Zap size={18} className="text-white" />,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 2,
    title: "Why The Best Design Choices Are Often Invisible",
    slug: 'invisible-design',
    date: 'July 10, 2026',
    category: 'Design',
    icon: <Activity size={18} className="text-white" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    title: "The Unspoken Rules of Open Source Collaboration",
    slug: 'open-source-rules',
    date: 'June 28, 2026',
    category: 'Technology',
    icon: <Search size={18} className="text-white" />,
    color: 'from-purple-500 to-pink-500'
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfbf9] relative overflow-hidden">


      {/* Hero Section */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center pointer-events-none px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center w-full max-w-6xl mx-auto flex flex-col items-center"
        >
          {/* A glass pill to add some flair */}
          <div className="mb-8 pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-lg text-xs font-bold tracking-widest uppercase text-black">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Thinking Platform
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#111] mb-8 leading-[0.95] drop-shadow-sm mix-blend-overlay">
            OBSERVE. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-purple-600">REFLECT. DISCUSS.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 font-medium max-w-2xl mx-auto bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
            Exploring ideas through stories, technology, and creativity.
          </p>
        </motion.div>
      </div>

      {/* Split Content Section */}
      <div className="relative z-20 w-full bg-white rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row gap-20">
          
          {/* Left Side: Sticky Text */}
          <div className="lg:w-1/3 relative">
            <div className="sticky top-32">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 text-[#111] leading-[1.1]">
                A timeline tailored to your observations
              </h2>
              <p className="text-neutral-500 text-lg leading-relaxed mb-8 font-medium">
                When observing everyday life, it's hard to know what's next. This intellectual archive guides you through the stories, reflections, and bigger pictures that define your journey.
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
              {stories.map((story, index) => (
                <motion.div 
                  key={story.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="relative pl-24"
                >
                  {/* Vibrant Node Connector */}
                  <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br ${story.color} rounded-full z-10 shadow-lg`} />
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-1 bg-neutral-100" />

                  <Link href={`/stories/${story.slug}`}>
                    <div className="bg-white p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-neutral-100 group hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer relative overflow-hidden">
                      
                      {/* Subtle hover gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 bg-gradient-to-br ${story.color} rounded-xl shadow-md`}>
                            {story.icon}
                          </div>
                          <span className="text-xs font-black text-black uppercase tracking-widest">{story.category}</span>
                        </div>
                        <span className="text-sm text-neutral-400 font-bold">{story.date}</span>
                      </div>
                      
                      <h3 className="text-3xl font-black text-[#111] mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-neutral-500 transition-all relative z-10">
                        {story.title}
                      </h3>
                      
                      <div className="mt-8 flex items-center text-sm font-black text-neutral-400 group-hover:text-black transition-colors relative z-10 uppercase tracking-widest">
                        Enter Director's Cut
                        <ArrowRight size={18} className="ml-3 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
