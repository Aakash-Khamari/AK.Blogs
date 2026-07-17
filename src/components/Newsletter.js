'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')

  const subscribe = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])

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
    <div className="bg-neutral-50 rounded-3xl p-10 md:p-16 text-center border border-neutral-200">
      <h2 className="text-3xl font-black text-[#111] mb-4">Join the Observers</h2>
      <p className="text-lg text-neutral-500 mb-8 max-w-lg mx-auto">
        Every Sunday, I share one new observation, one reflection, and a question worth discussing. No spam. Just better thinking.
      </p>

      {status === 'success' ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-200">
          {message}
        </div>
      ) : (
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative">
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-6 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black font-medium"
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Join'}
          </button>
        </form>
      )}
      
      {status === 'error' && (
        <p className="text-red-500 mt-4 text-sm font-semibold">{message}</p>
      )}
    </div>
  )
}
