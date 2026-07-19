'use client'

import Link from 'next/link'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const { user, profile } = useAuth()

  return (
    <header className="w-full p-6 flex justify-between items-center z-50">
      <Link href="/">
        <div className="text-2xl font-black tracking-tighter text-[#111] hover:opacity-70 transition">
          Aakash<span className="text-red-500">Khamari</span>
        </div>
      </Link>
      
      {/* Central Navigation */}
      <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#444] absolute left-1/2 -translate-x-1/2">
        <Link href="/about" className="hover:text-black transition">About</Link>
        <Link href="/observations" className="hover:text-black transition">Observations</Link>
        <Link href="/notebook" className="hover:text-black transition">Notebook</Link>
        <Link href="/reading-room" className="hover:text-black transition">Reading Room</Link>
        <Link href="/now" className="hover:text-black transition">Now</Link>
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/profile">
              <button className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black px-4 py-2 transition-all">
                Profile
              </button>
            </Link>
            {profile?.role === 'admin' && (
              <Link href="/admin">
                <button className="text-xs font-black uppercase tracking-widest border border-neutral-200 text-black px-5 py-2.5 rounded-full hover:border-black transition-all">
                  Director Access
                </button>
              </Link>
            )}
          </>
        ) : (
          <Link href="/login">
            <button className="text-xs font-black uppercase tracking-widest bg-black text-white px-5 py-2.5 rounded-full hover:scale-105 hover:shadow-lg transition-all">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  )
}
