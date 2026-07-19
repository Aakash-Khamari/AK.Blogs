import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminReadingRoom() {
  const supabase = await createClient()
  
  const { data: items } = await supabase
    .from('reading_room')
    .select('*')
    .order('created_at', { ascending: false })

  async function addItem(formData) {
    'use server'
    const title = formData.get('title')
    const author = formData.get('author')
    const category = formData.get('category')
    const link = formData.get('link')
    const why_it_mattered = formData.get('why_it_mattered')
    const favourite_quote = formData.get('favourite_quote')
    const rating = parseInt(formData.get('rating'), 10)

    const supabase = await createClient()
    await supabase.from('reading_room').insert([{ title, author, category, link, why_it_mattered, favourite_quote, rating }])
    
    revalidatePath('/admin/reading-room')
  }

  async function deleteItem(formData) {
    'use server'
    const id = formData.get('id')
    const supabase = await createClient()
    await supabase.from('reading_room').delete().eq('id', id)
    
    revalidatePath('/admin/reading-room')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#111] dark:text-white mb-2">Reading Room</h1>
        <p className="text-neutral-500 font-medium">Manage books, papers, and essays.</p>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-12">
        <h2 className="text-xl font-bold text-[#111] dark:text-white mb-4">Add to Reading Room</h2>
        <form action={addItem} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input 
              type="text" 
              name="title" 
              placeholder="Title" 
              required 
              className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
            />
            <input 
              type="text" 
              name="author" 
              placeholder="Author" 
              className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
            />
          </div>
          
          <div className="flex gap-4">
            <input 
              type="text" 
              name="category" 
              placeholder="Category (e.g. Book, Essay)" 
              className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
            />
            <input 
              type="number" 
              name="rating" 
              min="1" 
              max="5" 
              placeholder="Rating (1-5)" 
              className="w-32 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
            />
          </div>

          <input 
            type="url" 
            name="link" 
            placeholder="URL Link (Optional)" 
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
          />
          
          <textarea name="why_it_mattered" placeholder="Why it mattered..." className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white min-h-[80px]" />
          <textarea name="favourite_quote" placeholder="Favourite quote..." className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white min-h-[80px]" />
          
          <button type="submit" className="self-start bg-[#111] dark:bg-white text-white dark:text-[#111] px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
            Add to Library
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Author</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Rating</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {items && items.length > 0 ? (
              items.map(item => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#111] dark:text-white">{item.title}</td>
                  <td className="px-6 py-4 font-medium text-neutral-500">{item.author}</td>
                  <td className="px-6 py-4 font-mono text-xs text-yellow-500">{'★'.repeat(item.rating || 0)}</td>
                  <td className="px-6 py-4">
                    <form action={deleteItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-neutral-500">Reading room is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
