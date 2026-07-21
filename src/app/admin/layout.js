'use client'

import Link from 'next/link'
import { LayoutDashboard, PenSquare, LogOut, Hash, Calendar, BookOpen, Briefcase, Mail, BarChart2, MessageSquare, Users } from 'lucide-react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        setIsAuthorized(true)
      } else {
        // Not an admin
        router.push('/')
      }
    }

    checkAdmin()
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-500 font-medium">
        Verifying Access...
      </div>
    )
  }

  const isActive = (path) => pathname === path

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#111] flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#111] dark:text-white tracking-tight">Admin<span className="text-red-500">.</span></h2>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/editor" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${pathname?.startsWith('/admin/editor') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <PenSquare size={18} />
            Write Story
          </Link>
          <Link href="/admin/themes" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/themes') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <Hash size={18} />
            Themes
          </Link>
          <Link href="/admin/daily" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/daily') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <Calendar size={18} />
            Daily Notices
          </Link>
          <Link href="/admin/reading-room" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/reading-room') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <BookOpen size={18} />
            Reading Room
          </Link>
          <Link href="/admin/projects" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/projects') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <Briefcase size={18} />
            Projects
          </Link>
          <Link href="/admin/newsletter" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/newsletter') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <Mail size={18} />
            Newsletter
          </Link>
          <Link href="/admin/analytics" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/analytics') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <BarChart2 size={18} />
            Analytics
          </Link>
          <Link href="/admin/comments" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/comments') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <MessageSquare size={18} />
            Comments
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/users') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#111] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium'}`}>
            <Users size={18} />
            Users
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-900">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-neutral-900 rounded-md transition-colors font-medium">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 h-full border-r border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#111] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#111] dark:text-white tracking-tight">Admin<span className="text-red-500">.</span></h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-500">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 px-4 flex flex-col gap-2 mt-2 overflow-y-auto pb-6">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/editor" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${pathname?.startsWith('/admin/editor') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <PenSquare size={18} /> Write Story
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/themes" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/themes') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <Hash size={18} /> Themes
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/daily" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/daily') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <Calendar size={18} /> Daily Notices
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/reading-room" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/reading-room') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <BookOpen size={18} /> Reading Room
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/projects" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/projects') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <Briefcase size={18} /> Projects
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/newsletter" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/newsletter') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <Mail size={18} /> Newsletter
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/analytics" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/analytics') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <BarChart2 size={18} /> Analytics
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/comments" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/comments') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <MessageSquare size={18} /> Comments
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admin/users" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/users') ? 'bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400 font-medium'}`}>
                <Users size={18} /> Users
              </Link>
            </nav>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-900">
              <form action="/auth/signout" method="post">
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                  <LogOut size={18} /> Sign Out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col h-screen">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white dark:bg-[#111] border-b border-neutral-200 dark:border-neutral-900 p-4 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-[#111] dark:text-white tracking-tight">Admin<span className="text-red-500">.</span></h2>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-[#111] dark:text-white">
            <Menu size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
