import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, category, type, published, created_at, views')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#111] mb-2">Dashboard</h1>
          <p className="text-neutral-500 font-medium">Manage your archive of observations and notebook entries.</p>
        </div>
        <Link href="/admin/editor">
          <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 hover:shadow-lg transition-all">
            <Plus size={16} />
            New Entry
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[800px]">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Views</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-[#333]">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50 transition cursor-pointer">
                  <td className="px-6 py-4 font-bold text-[#111]">
                    <Link href={`/admin/editor/${post.id}`} className="block">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-500">
                    <Link href={`/admin/editor/${post.id}`} className="block">
                      {post.category || 'Uncategorized'}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/editor/${post.id}`} className="block">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest ${post.published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-400">
                    <Link href={`/admin/editor/${post.id}`} className="block text-xs uppercase tracking-widest">
                      {post.type}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-400">
                    <Link href={`/admin/editor/${post.id}`} className="block">
                      {post.views || 0}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 font-medium">
                    <Link href={`/admin/editor/${post.id}`} className="block">
                      {new Date(post.created_at).toLocaleDateString()}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-neutral-500 font-medium">
                  No entries yet. Time to write your first observation!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
