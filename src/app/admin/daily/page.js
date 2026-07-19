import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function AdminDailyNotices() {
  const supabase = await createClient()
  
  const { data: notices } = await supabase
    .from('daily_notices')
    .select('*')
    .order('date', { ascending: false })

  async function addNotice(formData) {
    'use server'
    const sentence = formData.get('sentence')
    const date = formData.get('date')
    const reflection = formData.get('reflection')
    // Generate simple permalink from date
    const permalink = date

    const supabase = await createClient()
    await supabase.from('daily_notices').insert([{ sentence, date, reflection, permalink }])
    
    revalidatePath('/admin/daily')
  }

  async function deleteNotice(formData) {
    'use server'
    const id = formData.get('id')
    const supabase = await createClient()
    await supabase.from('daily_notices').delete().eq('id', id)
    
    revalidatePath('/admin/daily')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#111] dark:text-white mb-2">Today I Noticed</h1>
        <p className="text-neutral-500 font-medium">Manage your daily observations.</p>
      </div>

      <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-12">
        <h2 className="text-xl font-bold text-[#111] dark:text-white mb-4">Add New Notice</h2>
        <form action={addNotice} className="flex flex-col gap-4">
          <input 
            type="date" 
            name="date" 
            required 
            defaultValue={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white w-48"
          />
          <input 
            type="text" 
            name="sentence" 
            placeholder="One sentence. One observation." 
            required 
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white"
          />
          <textarea 
            name="reflection" 
            placeholder="Optional reflection..." 
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-transparent dark:text-white min-h-[100px]"
          />
          <button type="submit" className="self-start bg-[#111] dark:bg-white text-white dark:text-[#111] px-6 py-2 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
            Publish Notice
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Sentence</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {notices && notices.length > 0 ? (
              notices.map(notice => (
                <tr key={notice.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{notice.date}</td>
                  <td className="px-6 py-4 font-bold text-[#111] dark:text-white">"{notice.sentence}"</td>
                  <td className="px-6 py-4">
                    <form action={deleteNotice}>
                      <input type="hidden" name="id" value={notice.id} />
                      <button type="submit" className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center text-neutral-500">No daily notices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
