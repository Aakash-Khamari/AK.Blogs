'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'

export default function SingleProject() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setProject(data)
      }
      setLoading(false)
    }

    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-serif text-[#111] dark:text-white">Project not found</h1>
        <Link href="/projects" className="text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32 pt-24 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6">
        
        <Link href="/projects" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-16">
          <ArrowLeft size={14} className="mr-2" />
          All Projects
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">
              Case Study
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
              {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-[#111] dark:text-white leading-tight tracking-tight mb-8">
            {project.title}
          </h1>
          
          {project.tech && (
            <div className="flex items-center gap-2 mb-16 flex-wrap">
              {project.tech.split(',').map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest rounded-full">
                  {tech.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none font-serif text-lg leading-relaxed space-y-12">
            
            {project.problem && (
              <section>
                <h2 className="text-xl font-sans font-bold text-[#111] dark:text-white uppercase tracking-widest mb-4">The Problem</h2>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{project.problem}</div>
              </section>
            )}

            {project.why_built && (
              <section>
                <h2 className="text-xl font-sans font-bold text-[#111] dark:text-white uppercase tracking-widest mb-4">Why I Built It</h2>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{project.why_built}</div>
              </section>
            )}

            {project.process && (
              <section>
                <h2 className="text-xl font-sans font-bold text-[#111] dark:text-white uppercase tracking-widest mb-4">The Process</h2>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{project.process}</div>
              </section>
            )}

            {project.lessons && (
              <section>
                <h2 className="text-xl font-sans font-bold text-[#111] dark:text-white uppercase tracking-widest mb-4">Lessons Learned</h2>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{project.lessons}</div>
              </section>
            )}

            {project.outcome && (
              <section>
                <h2 className="text-xl font-sans font-bold text-[#111] dark:text-white uppercase tracking-widest mb-4">Outcome</h2>
                <div className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{project.outcome}</div>
              </section>
            )}

          </div>
        </motion.div>
      </div>
    </main>
  )
}
