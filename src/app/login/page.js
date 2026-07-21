'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, display_name: username }
          ])
          if (profileError) console.error("Error creating profile:", profileError)
        }

        setStatus('success')
        setMessage('Account created! Switching to sign in...')
        setTimeout(() => {
          setIsSignUp(false)
          setPassword('')
          setConfirmPassword('')
          setStatus('idle')
          setMessage('')
        }, 2000)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setStatus('success')
        setMessage('Logged in successfully! Redirecting...')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage(error.message || 'Authentication failed.')
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfbf9] dark:bg-[#0a0a0a] flex flex-col justify-center items-center px-6 pt-20">
      <div className="w-full max-w-md bg-white dark:bg-[#111] p-6 sm:p-10 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-neutral-100 dark:border-neutral-800 text-center">
        <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-black">
          AK
        </div>
        
        <h1 className="text-3xl font-black tracking-tighter text-[#111] dark:text-white mb-2">
          {isSignUp ? 'Become an Observer' : 'Welcome Back'}
        </h1>
        <p className="text-neutral-500 font-medium mb-8">
          {isSignUp 
            ? 'Sign up to join the discussion and save your favorite observations.'
            : 'Sign in to continue reading and discussing observations.'}
        </p>

        {status === 'success' && !isSignUp ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-2xl font-bold border border-green-200">
            {message}
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4 text-left">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-6 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-medium pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-6 py-4 rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:ring-white bg-white dark:bg-[#1a1a1a] text-black dark:text-white font-medium pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50 mt-4"
            >
              {status === 'loading' ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        )}
        
        {status === 'error' && (
          <p className="text-red-500 mt-6 text-sm font-semibold">{message}</p>
        )}
        {status === 'success' && isSignUp && (
          <p className="text-green-600 mt-6 text-sm font-semibold">{message}</p>
        )}

        <div className="mt-8 text-sm font-bold text-neutral-500">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp)
              setStatus('idle')
              setMessage('')
            }}
            className="text-black dark:text-white hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </main>
  )
}
