import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminThemes() {
  const supabase = await createClient()
  
  const { data: themes } = await supabase
    .from('themes')
    .select('*')
    .order('created_at', { ascending: false })

  async function addTheme(formData) {
    'use server'
    const name = formData.get('name')
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const supabase = await createClient()
    await supabase.from('themes').insert([{ name, slug }])
    
    revalidatePath('/admin/themes')
  }

  async function deleteTheme(formData) {
    'use server'
    const id = formData.get('id')
    const supabase = await createClient()
    await supabase.from('themes').delete().eq('id', id)
    
    revalidatePath('/admin/themes')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#111] dark:text-white mb-2">Themes</h1>
        <p className="text-neutral-500 font-medium">Manage knowledge graph themes.</p>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-12">
        <h2 className="text-xl font-bold text-[#111] dark:text-white mb-4">Add New Theme</h2>
        <form action={addTheme} className="flex gap-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Theme Name (e.g. Behavioral Economics)" 
            required 
            className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
          />
          <button type="submit" className="bg-[#111] dark:bg-white text-white dark:text-[#111] px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
            Add
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Slug</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {themes && themes.length > 0 ? (
              themes.map(theme => (
                <tr key={theme.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#111] dark:text-white">{theme.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{theme.slug}</td>
                  <td className="px-6 py-4">
                    <form action={deleteTheme}>
                      <input type="hidden" name="id" value={theme.id} />
                      <button type="submit" className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-neutral-500">No themes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
