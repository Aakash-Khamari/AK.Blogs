'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import MagneticButton from '@/components/MagneticButton'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setStatus('idle')
      }, 5000)
    } catch (err) {
      console.error(err)
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] dark:bg-[#0a0a0a] transition-colors duration-500 pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#111] dark:text-white mb-6 uppercase">
              Get in <span className="text-indigo-600 dark:text-indigo-400">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-2xl">
              Whether you have a project in mind, a question about my work, or just want to say hi, my inbox is always open.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[#111] p-8 md:p-12 rounded-[2rem] shadow-sm border border-neutral-200 dark:border-neutral-900">
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center gap-3 font-medium border border-green-200 dark:border-green-900/50"
              >
                <CheckCircle size={20} />
                Message sent successfully! I'll get back to you soon.
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 font-medium border border-red-200 dark:border-red-900/50"
              >
                <AlertCircle size={20} />
                {errorMessage}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Subject (Optional)</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="What is this regarding?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[#111] dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                placeholder="Hello Aakash, I would like to discuss..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <MagneticButton>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
