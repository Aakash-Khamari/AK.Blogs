'use client'

import Link from 'next/link'
import { useAuth } from './AuthContext'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import MagneticButton from './MagneticButton'

export default function Navbar() {
  const { user, profile } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="w-full p-6 flex justify-between items-center z-[60] relative">
        <Link href="/">
          <div className="text-2xl font-black tracking-tighter text-[#111] dark:text-white hover:opacity-70 transition">
            Aakash<span className="text-red-500">Khamari</span>
          </div>
        </Link>
        
        {/* Central Navigation (Desktop) */}
        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#444] dark:text-neutral-400 absolute left-1/2 -translate-x-1/2">
          <Link href="/writing" className="hover:text-black dark:hover:text-white transition">Writing</Link>
          <Link href="/projects" className="hover:text-black dark:hover:text-white transition">Projects</Link>
          <Link href="/reading-room" className="hover:text-black dark:hover:text-white transition">Reading Room</Link>
          <Link href="/now" className="hover:text-black dark:hover:text-white transition">Now</Link>
          <Link href="/about" className="hover:text-black dark:hover:text-white transition">About</Link>
          <Link href="/contact" className="hover:text-black dark:hover:text-white transition">Contact</Link>
        </nav>

        {/* Right Side Actions (Desktop & Mobile) */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/profile">
                  <MagneticButton>
                    <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white px-4 py-2 transition-all">
                      Profile
                    </button>
                  </MagneticButton>
                </Link>
                {profile?.role === 'admin' && (
                  <Link href="/admin">
                    <MagneticButton>
                      <button className="text-xs font-black uppercase tracking-widest border border-neutral-200 dark:border-neutral-700 text-black dark:text-white px-5 py-2.5 rounded-full hover:border-black dark:hover:border-white transition-all">
                        Director Access
                      </button>
                    </MagneticButton>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/login">
                <MagneticButton>
                  <button className="text-xs font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all">
                    Sign In
                  </button>
                </MagneticButton>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-black dark:text-white z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#fcfbf9] dark:bg-[#0a0a0a] z-[55] flex flex-col items-center justify-center gap-8"
          >
            <nav className="flex flex-col items-center gap-8 text-xl font-black uppercase tracking-widest text-black dark:text-white">
              <Link href="/writing" onClick={() => setIsMobileMenuOpen(false)}>Writing</Link>
              <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</Link>
              <Link href="/reading-room" onClick={() => setIsMobileMenuOpen(false)}>Reading Room</Link>
              <Link href="/now" onClick={() => setIsMobileMenuOpen(false)}>Now</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              
              <div className="w-12 h-px bg-neutral-200 dark:bg-neutral-800 my-4" />
              
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                  {profile?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Director Access</Link>
                  )}
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
