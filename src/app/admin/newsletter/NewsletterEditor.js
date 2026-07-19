'use client'

import { useState } from 'react'
import { Send, Loader2, Info } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function NewsletterEditor({ subscriberCount }) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('idle') // idle, sending, success, error
  const [message, setMessage] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!subject.trim() || !content.trim()) {
      setStatus('error')
      setMessage('Subject and content are required.')
      return
    }

    if (!confirm(`Are you sure you want to send this email to ${subscriberCount} subscribers? This action cannot be undone.`)) {
      return
    }

    setStatus('sending')
    setMessage('')

    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to send newsletter')

      setStatus('success')
      setMessage(`Successfully sent newsletter to ${data.sentCount} subscribers!`)
      setSubject('')
      setContent('')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage(err.message || 'An error occurred while sending.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor */}
      <div className="bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#111] dark:text-white mb-6 tracking-tight">Compose Email</h2>
        
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">Subject Line</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. A Question Worth Discussing: Focus"
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-[#111] dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">Email Body (Markdown)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter here using Markdown..."
              rows={12}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-y text-[#111] dark:text-white font-mono text-sm"
              required
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
              <Info size={14} />
              <span>Supports standard Markdown (bold, italics, links, lists).</span>
            </div>
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm">
              {message}
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-medium text-sm">
              {message}
            </div>
          )}

          <button 
            type="submit"
            disabled={status === 'sending' || subscriberCount === 0}
            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {status === 'sending' ? (
              <><Loader2 size={18} className="animate-spin" /> Sending to {subscriberCount}...</>
            ) : (
              <><Send size={18} /> Send to {subscriberCount} Subscribers</>
            )}
          </button>
        </form>
      </div>

      {/* Preview */}
      <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-900 rounded-3xl p-8 sticky top-8 h-fit">
        <h2 className="text-xl font-bold text-[#111] dark:text-white mb-6 tracking-tight">Live Preview</h2>
        
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm min-h-[400px]">
          <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4 mb-6">
            <div className="text-sm text-neutral-400 font-medium mb-1">Subject:</div>
            <div className="text-lg font-bold text-[#111] dark:text-white">
              {subject || <span className="text-neutral-300 italic">No subject...</span>}
            </div>
          </div>

          <div className="prose prose-neutral max-w-none">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-neutral-300 dark:text-neutral-700 italic">Your email content will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
