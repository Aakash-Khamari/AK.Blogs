'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, ArrowRight } from 'lucide-react'
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

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6 mb-20">
        <h1 className="text-4xl md:text-5xl font-serif text-[#111] dark:text-white mb-6 tracking-tight">
          Projects
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-sans max-w-2xl leading-relaxed">
          Deep dives into what I'm building, why I built it, and the lessons learned along the way.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {loading ? (
          <div className="flex justify-center py-20 text-neutral-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium border-t border-neutral-100 dark:border-neutral-900 pt-8">
            No projects recorded yet.
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group border-b border-neutral-100 dark:border-neutral-900 pb-16 last:border-0"
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                      {project.tech || 'Case Study'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
                      {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-serif text-[#111] dark:text-neutral-100 group-hover:text-red-500 transition-colors tracking-tight">
                    {project.title}
                  </h2>

                  <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans mt-2">
                    <span className="font-bold text-[#111] dark:text-neutral-300">The Problem: </span>
                    {project.problem || "A brief description of the problem being solved."}
                  </p>
                  
                  <div className="flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors mt-4">
                    Read Case Study
                    <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </main>
  )
}
