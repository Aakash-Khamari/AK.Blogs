'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomeClient({ notice, latestObservation, continueReading, featuredProject, latestNotebook }) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24 pb-32 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-6 space-y-24">
        
        {/* 1. Today I Noticed */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Today I Noticed</span>
          </div>
          {notice ? (
            <div className="group">
              <Link href={`/daily/${notice.permalink || notice.id}`}>
                <h2 className="text-3xl md:text-4xl font-serif text-[#111] dark:text-white leading-snug tracking-tight group-hover:text-red-500 transition-colors">
                  "{notice.sentence}"
                </h2>
                <div className="mt-4 text-sm font-medium text-neutral-400">
                  {new Date(notice.date || notice.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </Link>
            </div>
          ) : (
             <div className="text-lg font-serif text-neutral-500 italic">"Some stories deserve more than 3,000 characters."</div>
          )}
        </section>

        <div className="w-full h-px bg-neutral-100 dark:bg-neutral-900"></div>

        {/* 2. Latest Observation */}
        <section>
          <div className="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Latest Observation</div>
          {latestObservation ? (
            <Link href={`/observations/${latestObservation.slug}`} className="group block">
              <h3 className="text-2xl font-serif text-[#111] dark:text-white mb-3 group-hover:text-red-500 transition-colors">
                {latestObservation.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed font-sans">
                {latestObservation.content_story || "Read this observation..."}
              </p>
              <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                Read Observation <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <div className="text-neutral-500">No observations yet.</div>
          )}
        </section>

        {/* 3. Continue Reading */}
        {continueReading && (
          <section>
            <div className="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Continue Reading</div>
            <Link href={`/observations/${continueReading.slug}`} className="group block p-8 border border-neutral-100 dark:border-neutral-900 hover:border-black dark:hover:border-white transition-colors">
              <h3 className="text-xl font-serif text-[#111] dark:text-white mb-2 group-hover:text-red-500 transition-colors">
                {continueReading.title}
              </h3>
              <div className="flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                Resume <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </section>
        )}

        {/* 4. Featured Project */}
        {featuredProject && (
          <section>
            <div className="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Featured Project</div>
            <Link href={`/projects/${featuredProject.slug}`} className="group block">
              <h3 className="text-2xl font-serif text-[#111] dark:text-white mb-3 group-hover:text-red-500 transition-colors">
                {featuredProject.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed font-sans">
                {featuredProject.problem || "View project details..."}
              </p>
              <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                View Project <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </section>
        )}

        {/* 5. Latest Notebook */}
        {latestNotebook && (
          <section>
            <div className="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-3">
              Latest Notebook
              {latestNotebook.notebook_type && (
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 text-[10px] rounded-sm">
                  {latestNotebook.notebook_type}
                </span>
              )}
            </div>
            <Link href={`/notebook/${latestNotebook.slug}`} className="group block">
              <h3 className="text-xl font-serif text-[#111] dark:text-white mb-3 group-hover:text-red-500 transition-colors">
                {latestNotebook.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed font-sans">
                {latestNotebook.content_story || "Read this entry..."}
              </p>
              <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                Read Entry <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}
