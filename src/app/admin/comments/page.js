'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Trash2, Loader2, MessageSquare, AlertTriangle } from 'lucide-react'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    // Fetch comments and join with profiles to get the author's name
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        stance,
        created_at,
        post_slug,
        user_id,
        profiles ( display_name )
      `)
      .order('created_at', { ascending: false })
    
    if (data) {
      setComments(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this comment?')) return
    
    try {
      const { error } = await supabase.from('comments').delete().eq('id', id)
      if (error) throw error
      
      setComments(comments.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
      alert('Error deleting comment')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex flex-col transition-colors duration-500">
      {/* Top Bar */}
      <header className="bg-white dark:bg-[#111] border-b border-neutral-200 dark:border-neutral-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-neutral-500 hover:text-black dark:hover:text-white transition flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-800" />
          <span className="font-black text-[#111] dark:text-white text-lg tracking-tighter flex items-center gap-2">
            <MessageSquare size={18} /> Moderation
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#111] dark:text-white mb-2">Comment Moderation</h1>
          <p className="text-neutral-500 font-medium">Review and manage discussions across all posts.</p>
        </div>

        <div className="bg-white dark:bg-[#111] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20 text-neutral-400">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-20 text-neutral-500 font-medium">
              No comments have been posted yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {comments.map((comment) => (
                <div key={comment.id} className="p-6 md:p-8 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition flex flex-col md:flex-row gap-6 justify-between group">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#111] dark:text-white">
                        {comment.profiles?.display_name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-neutral-400">
                        {comment.profiles?.email}
                      </span>
                      <span className="text-sm text-neutral-300 dark:text-neutral-700">•</span>
                      <span className="text-sm text-neutral-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                        comment.stance === 'agree' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {comment.stance}
                      </span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                      On Post: {comment.post_slug}
                    </div>
                    <p className="text-[#333] dark:text-neutral-300 text-lg leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition flex items-center gap-2 text-sm font-bold"
                    >
                      <Trash2 size={18} />
                      <span className="md:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
