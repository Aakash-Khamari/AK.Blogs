'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Loader2, Code, Terminal, Layers, Hexagon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProjectsIndex() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setProjects(data)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const getIconForTech = (tech) => {
    if (!tech) return <Code size={18} className="text-white" />
    const lowerTech = tech.toLowerCase()
    if (lowerTech.includes('react') || lowerTech.includes('next')) return <Hexagon size={18} className="text-white" />
    if (lowerTech.includes('python') || lowerTech.includes('ai')) return <Terminal size={18} className="text-white" />
    return <Layers size={18} className="text-white" />
  }

  const getColorForTech = (tech) => {
    if (!tech) return 'from-neutral-500 to-neutral-700'
    const lowerTech = tech.toLowerCase()
    if (lowerTech.includes('react') || lowerTech.includes('next')) return 'from-blue-500 to-indigo-500'
    if (lowerTech.includes('python') || lowerTech.includes('ai')) return 'from-green-500 to-emerald-600'
    return 'from-orange-500 to-red-500'
  }

  return (
    <main className="min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen">
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 25, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-200 dark:bg-blue-900 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-32 pt-24">
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#111] dark:text-white mb-6">
            PROJECTS.
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
            Deep dives into what I'm building, why I built it, and the lessons learned along the way.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-1 bg-neutral-100 dark:bg-neutral-900 rounded-full" />
          
          <div className="space-y-16">
            {loading ? (
              <div className="flex justify-center py-20 text-neutral-400 pl-24">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 font-medium pl-24">
                No projects recorded yet.
              </div>
            ) : (
              projects.map((project, index) => {
                const color = getColorForTech(project.tech)
                const icon = getIconForTech(project.tech)
                
                return (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="relative pl-24"
                  >
                    <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br ${color} rounded-full z-10 shadow-lg ring-4 ring-white dark:ring-[#0a0a0a]`} />
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-1 bg-neutral-100 dark:bg-neutral-900" />

                    <Link href={`/projects/${project.slug}`}>
                      <div className="bg-white dark:bg-[#111] p-10 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.03)] border border-neutral-100 dark:border-neutral-800 group hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.05)] transition-all duration-300 cursor-pointer relative overflow-hidden">
                        
                        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 bg-gradient-to-br ${color} rounded-xl shadow-md`}>
                              {icon}
                            </div>
                            <span className="text-xs font-black text-black dark:text-white uppercase tracking-widest">
                              {project.tech || 'Case Study'}
                            </span>
                          </div>
                          <span className="text-sm text-neutral-400 font-bold">
                            {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-black text-[#111] dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-neutral-500 dark:group-hover:from-white dark:group-hover:to-neutral-400 transition-all relative z-10">
                          {project.title}
                        </h3>

                        <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans relative z-10">
                          <span className="font-bold text-[#111] dark:text-neutral-300">The Problem: </span>
                          {project.problem || "A brief description of the problem being solved."}
                        </p>
                        
                        <div className="mt-8 flex items-center text-sm font-black text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors relative z-10 uppercase tracking-widest">
                          Read Case Study
                          <ArrowRight size={18} className="ml-3 transform group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
