import { BarChart2, TrendingUp, Users, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsDashboard() {
  const supabase = await createClient()

  // 1. Total Registered Users (Proxy for visitors right now)
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // 2. Total Page Views
  const { data: posts } = await supabase
    .from('posts')
    .select('title, views')
    .order('views', { ascending: false })
  
  const totalViews = posts?.reduce((acc, post) => acc + (post.views || 0), 0) || 0

  // 3. Top Performing Posts
  const topPosts = posts?.slice(0, 3) || []

  // 4. Total Subscribers
  const { count: subsCount } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-neutral-500 hover:text-black transition flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="h-6 w-px bg-neutral-300" />
          <span className="font-black text-lg tracking-tighter flex items-center gap-2">
            <BarChart2 size={18} /> Analytics
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#111] mb-2">Platform Analytics</h1>
          <p className="text-neutral-500 font-medium">Real-time metrics from your database. (Some advanced metrics require an external analytics provider).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 text-neutral-500 mb-4">
              <Users size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Total Users</span>
            </div>
            <div className="text-4xl font-black text-[#111]">{usersCount || 0}</div>
            <div className="text-sm font-bold text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> Registered Accounts
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 text-neutral-500 mb-4">
              <BarChart2 size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Page Views</span>
            </div>
            <div className="text-4xl font-black text-[#111]">{totalViews}</div>
            <div className="text-sm font-bold text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> Across all posts
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-3 text-neutral-500 mb-4">
              <Users size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Subscribers</span>
            </div>
            <div className="text-4xl font-black text-[#111]">{subsCount || 0}</div>
            <div className="text-sm font-bold text-neutral-400 mt-2 flex items-center gap-1">
              Newsletter Signups
            </div>
          </div>

          <div className="bg-neutral-100 p-6 rounded-3xl border border-neutral-200 border-dashed shadow-sm opacity-60">
            <div className="flex items-center gap-3 text-neutral-500 mb-4">
              <Clock size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Avg Time</span>
            </div>
            <div className="text-2xl font-black text-neutral-400">Needs Tracker</div>
            <div className="text-sm font-bold text-neutral-400 mt-2 flex items-center gap-1">
              (e.g., Google Analytics)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-6">Top Performing Posts</h3>
            <div className="space-y-6">
              {topPosts.length > 0 ? topPosts.map((post, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="font-bold text-[#111] group-hover:text-indigo-600 transition truncate pr-4">{post.title}</span>
                  <span className="text-neutral-500 font-medium">{post.views || 0}</span>
                </div>
              )) : (
                <div className="text-neutral-400 font-medium">No posts available.</div>
              )}
            </div>
          </div>

          <div className="bg-neutral-100 p-8 rounded-3xl border border-neutral-200 border-dashed shadow-sm opacity-60">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-6">Traffic Sources</h3>
            <div className="space-y-6">
              <div className="text-neutral-400 font-medium">
                Requires an external analytics tool to track referral sources (e.g., Plausible, Vercel Web Analytics, or GA4).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
