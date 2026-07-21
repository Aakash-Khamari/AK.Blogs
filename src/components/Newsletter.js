'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [userEmail, setUserEmail] = useState(null)
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [])

  const subscribe = async (e) => {
    e.preventDefault()
    const targetEmail = userEmail || email
    if (!targetEmail) return

    setStatus('loading')
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: targetEmail }])

      if (error) {
        if (error.code === '23505') { // unique violation
          setStatus('error')
          setMessage('You are already subscribed.')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setMessage('Thank you for subscribing to the observations.')
        setEmail('')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl p-10 md:p-16 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.03)] border border-neutral-100 dark:border-neutral-800 relative overflow-hidden group">
      
      {/* Subtle hover gradient like the cards */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200/50 to-neutral-50/50 dark:from-neutral-800/50 dark:to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-[#111] dark:text-white mb-4">Join the Observers</h2>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
          Every Sunday, I share one new observation, one reflection, and a question worth discussing. No spam. Just better thinking.
        </p>

        {status === 'success' ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-xl font-bold border border-green-200 dark:border-green-800/50 shadow-sm">
            {message}
          </div>
        ) : (
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
            {!userEmail && (
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-xl border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-medium shadow-sm transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
            )}
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className={`${userEmail ? 'w-full' : 'px-8'} py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 truncate`}
              title={userEmail ? `Join as ${userEmail}` : 'Join'}
            >
              {status === 'loading' ? 'Joining...' : (userEmail ? `Join as ${userEmail}` : 'Join')}
            </button>
          </form>
        )}
        
        {status === 'error' && (
          <p className="text-red-500 dark:text-red-400 mt-4 text-sm font-semibold">{message}</p>
        )}
      </div>
    </div>
  )
}
