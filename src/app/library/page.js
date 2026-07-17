'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LibraryIndex() {
  const [libraryData, setLibraryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [categories, setCategories] = useState(['All', 'story', 'idea'])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
      
      if (data) {
        setLibraryData(data)
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))]
        setCategories(['All', 'story', 'idea', ...uniqueCategories.filter(Boolean)])
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  const filteredLibrary = libraryData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    
    let matchesFilter = true
    if (activeFilter !== 'All') {
      if (activeFilter === 'story' || activeFilter === 'idea') {
        matchesFilter = item.type === activeFilter
      } else {
        matchesFilter = item.category === activeFilter
      }
    }
    
    return matchesSearch && matchesFilter
  })

  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-32 pt-12">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-[#111] mb-6">
          The <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Library.</span>
        </h1>
        <p className="text-xl text-neutral-500 font-medium max-w-2xl mb-12">
          Every piece ever published. Filter by topic, idea, or story.
        </p>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search for an observation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-lg font-medium shadow-sm transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map(tag => (
            <button 
              key={tag} 
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeFilter === tag ? 'bg-green-600 text-white border-green-600' : 'bg-white text-neutral-600 border-neutral-200 hover:border-black'} border capitalize`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20 text-neutral-400">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : filteredLibrary.length > 0 ? (
            filteredLibrary.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={item.type === 'story' ? `/stories/${item.slug}` : `/ideas/${item.slug}`}>
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-black uppercase tracking-widest ${item.type === 'story' ? 'text-red-500' : 'text-indigo-500'}`}>
                          {item.type}
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{item.category}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-[#111] group-hover:text-green-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="text-sm font-bold text-neutral-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-neutral-500 font-medium">
              No observations found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
