'use client'

import Link from 'next/link'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const { user, profile } = useAuth()

  return (
    <header className="w-full p-6 flex justify-between items-center z-50">
      <Link href="/">
        <div className="text-2xl font-black tracking-tighter text-[#111] hover:opacity-70 transition">
          AK<span className="text-red-500">.</span>Blogs
        </div>
      </Link>
      
      {/* Central Navigation */}
      <nav className="hidden md:flex gap-10 text-sm font-bold uppercase tracking-widest text-[#444] absolute left-1/2 -translate-x-1/2">
        <Link href="/stories" className="hover:text-black transition">Stories</Link>
        <Link href="/ideas" className="hover:text-black transition">Ideas</Link>
        <Link href="/library" className="hover:text-black transition">Library</Link>
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
