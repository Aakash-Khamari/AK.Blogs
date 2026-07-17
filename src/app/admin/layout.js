'use client'

import Link from 'next/link'
import { LayoutDashboard, PenSquare, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

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
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#111] tracking-tight">Admin<span className="text-red-500">.</span></h2>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
          <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin') ? 'bg-neutral-100 text-[#111] font-bold' : 'text-neutral-500 hover:text-[#111] hover:bg-neutral-50 font-medium'}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/editor" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${pathname?.startsWith('/admin/editor') ? 'bg-neutral-100 text-[#111] font-bold' : 'text-neutral-500 hover:text-[#111] hover:bg-neutral-50 font-medium'}`}>
            <PenSquare size={18} />
            Write Story
          </Link>
          <Link href="/admin/analytics" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/analytics') ? 'bg-neutral-100 text-[#111] font-bold' : 'text-neutral-500 hover:text-[#111] hover:bg-neutral-50 font-medium'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            Analytics
          </Link>
          <Link href="/admin/users" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/users') ? 'bg-neutral-100 text-[#111] font-bold' : 'text-neutral-500 hover:text-[#111] hover:bg-neutral-50 font-medium'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Users
          </Link>
          <Link href="/admin/comments" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/comments') ? 'bg-neutral-100 text-[#111] font-bold' : 'text-neutral-500 hover:text-[#111] hover:bg-neutral-50 font-medium'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Moderation
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors font-medium">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
