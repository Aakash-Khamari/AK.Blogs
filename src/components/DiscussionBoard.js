'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import Link from 'next/link'
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function DiscussionBoard({ prompt, postSlug }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [stance, setStance] = useState(null) // 'agree', 'disagree', 'neutral'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(display_name)')
      .eq('post_slug', postSlug)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setComments(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          post_slug: postSlug, 
          user_id: user.id, 
          content: newComment,
          stance: stance
        }
      ])
      .select('*, profiles(display_name)')

    if (!error && data) {
      setComments([data[0], ...comments])
      setNewComment('')
      setStance(null)
    }
  }

  return (
    <div className="mt-20 p-10 bg-indigo-50 dark:bg-[#111] border border-indigo-100 dark:border-neutral-800 rounded-[2rem]">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare size={18} className="text-indigo-500" />
        <h2 className="text-sm font-black tracking-widest text-indigo-500 uppercase">The Discussion</h2>
      </div>
      
      <p className="text-2xl font-black text-[#111] dark:text-white mb-8 leading-tight">
        {prompt}
      </p>
      
      {/* Input Area */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 mb-12">
          <div className="flex gap-4 mb-4">
            <button 
              type="button"
              onClick={() => setStance(stance === 'agree' ? null : 'agree')}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${stance === 'agree' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'} border`}
            >
              <ThumbsUp size={14} /> Agree
            </button>
            <button 
              type="button"
              onClick={() => setStance(stance === 'disagree' ? null : 'disagree')}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition ${stance === 'disagree' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50' : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'} border`}
            >
              <ThumbsDown size={14} /> Disagree
            </button>
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your observation..."
            className="w-full text-lg p-0 border-none focus:ring-0 resize-none mb-4 min-h-[100px] bg-transparent text-[#111] dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            required
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Post Observation
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 mb-12 text-center">
          <p className="text-neutral-500 font-medium mb-4">You must be an Observer to join the discussion.</p>
          <Link href="/login">
            <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition">
              Sign In
            </button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-neutral-500 font-medium">Loading discussion...</p>
        ) : comments.length === 0 ? (
          <p className="text-neutral-500 font-medium">No observations yet. Be the first to share your thoughts.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-[#111] dark:text-white">{comment.profiles?.display_name || 'Anonymous Observer'}</span>
                <span className="text-xs text-neutral-400 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              {comment.stance && (
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 w-fit px-2 py-1 rounded ${comment.stance === 'agree' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                  {comment.stance}
                </div>
              )}
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
