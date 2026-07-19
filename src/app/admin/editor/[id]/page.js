'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, FileText, Image as ImageIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminEditorEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [postType, setPostType] = useState('observation') // 'observation', 'notebook', or 'reading_room'
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [published, setPublished] = useState(true)

  // Story specific state
  const [storyContent, setStoryContent] = useState('')
  const [reflection, setReflection] = useState('')
  const [biggerPicture, setBiggerPicture] = useState('')
  const [questions, setQuestions] = useState('')
  const [behindTheStory, setBehindTheStory] = useState('')

  // Notebook specific state
  const [notebookContent, setNotebookContent] = useState('')
  const [discussionPrompt, setDiscussionPrompt] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      if (!id) return
      
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
      if (error) {
        console.error(error)
        alert('Could not load post')
        router.push('/admin')
        return
      }

      if (data) {
        setPostType(data.type || 'observation')
        setTitle(data.title || '')
        setCategory(data.category || '')
        setCoverImageUrl(data.cover_image_url || '')
        setPublished(data.published)

        if (data.type === 'observation') {
          setStoryContent(data.content_story || '')
          setReflection(data.content_reflection || '')
          setBiggerPicture(data.content_picture || '')
          setQuestions(data.content_questions ? data.content_questions.join('\n') : '')
          setBehindTheStory(data.content_behind || '')
        } else {
          setNotebookContent(data.content || '')
          setDiscussionPrompt(data.discussion_prompt || '')
        }
      }
      setLoading(false)
    }
    loadPost()
  }, [id, router])

  const handleSave = async (e, isPublished = true) => {
    e.preventDefault()
    
    // Generate slug from title
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    
    const postData = {
      title,
      slug: generatedSlug,
      category: category || 'Uncategorized',
      cover_image_url: coverImageUrl || null,
      published: isPublished,
      type: postType,
    }

    if (postType === 'observation') {
      postData.content_story = storyContent
      postData.content_reflection = reflection
      postData.content_picture = biggerPicture
      postData.content_questions = questions ? questions.split('\n').filter(q => q.trim() !== '') : []
      postData.content_behind = behindTheStory
    } else {
      postData.content = notebookContent
      postData.discussion_prompt = discussionPrompt
    }

    try {
      const { error } = await supabase.from('posts').update(postData).eq('id', id)
      if (error) throw error
      alert(`Updated ${postType.toUpperCase()}!`)
      router.push('/admin')
    } catch (err) {
      console.error(err)
      alert('Error updating post: ' + err.message)
    }
  }

  if (loading) return <div className="min-h-screen bg-neutral-50 p-12 text-neutral-500 font-medium">Loading post...</div>

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-neutral-500 hover:text-black transition flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="h-6 w-px bg-neutral-300" />
          <span className="font-black text-lg tracking-tighter">Edit {postType === 'observation' ? 'Observation' : (postType === 'notebook' ? 'Notebook Entry' : 'Reading Room')}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => handleSave(e, false)}
            className="text-neutral-500 font-bold uppercase tracking-widest text-xs hover:text-black transition"
          >
            Save as Draft
          </button>
          <button 
            onClick={(e) => handleSave(e, true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition"
          >
            <Save size={16} /> Publish Changes
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12">
        
        {/* Post Type Toggle */}
        <div className="flex p-1 bg-neutral-200 rounded-2xl mb-12 w-fit">
          <button 
            onClick={() => setPostType('observation')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${postType === 'observation' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-black'}`}
          >
            Observation
          </button>
          <button 
            onClick={() => setPostType('notebook')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${postType === 'notebook' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-black'}`}
          >
            Notebook Entry
          </button>
          <button 
            onClick={() => setPostType('reading_room')}
            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${postType === 'reading_room' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-black'}`}
          >
            Reading Room
          </button>
        </div>

        <div className="space-y-8 bg-white p-8 md:p-12 rounded-[2rem] border border-neutral-100 shadow-sm">
          {/* Common Fields */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Title</label>
            <input 
              type="text" 
              placeholder="e.g. The ₹500 Withdrawal..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-black text-[#111] placeholder:text-neutral-300 border-none focus:outline-none focus:ring-0 p-0"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Category / Tag</label>
              <input 
                type="text" 
                placeholder="e.g. Finance, Psychology..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-lg font-medium border-b border-neutral-200 focus:border-black focus:outline-none py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Cover Image URL</label>
              <div className="flex items-center gap-2 border-b border-neutral-200 py-2">
                <ImageIcon size={18} className="text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full text-lg font-medium focus:outline-none"
                />
              </div>
              {coverImageUrl && (
                <div className="mt-4 w-32 h-20 rounded-lg overflow-hidden border border-neutral-200">
                  <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-neutral-100 my-10" />

          {/* Conditional Editor Fields */}
          {postType === 'observation' ? (
            <div className="space-y-12">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> The Observation
                </label>
                <textarea 
                  rows={6}
                  placeholder="What happened? Set the scene..."
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  className="w-full text-lg leading-relaxed border border-neutral-200 rounded-xl p-6 focus:border-black focus:outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> My Reflection
                </label>
                <textarea 
                  rows={4}
                  placeholder="What did this make you realize?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full text-lg leading-relaxed border border-neutral-200 rounded-xl p-6 focus:border-black focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-orange-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> The Bigger Picture
                </label>
                <textarea 
                  rows={4}
                  placeholder="How does this tie into society, data, or broader trends?"
                  value={biggerPicture}
                  onChange={(e) => setBiggerPicture(e.target.value)}
                  className="w-full text-lg leading-relaxed border border-neutral-200 rounded-xl p-6 focus:border-black focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-purple-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Questions to Consider (one per line)
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Should financial literacy be mandatory?"
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="w-full text-lg leading-relaxed border border-neutral-200 rounded-xl p-6 focus:border-black focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-green-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Behind the Observation
                </label>
                <textarea 
                  rows={3}
                  placeholder="Context about when/where you wrote this..."
                  value={behindTheStory}
                  onChange={(e) => setBehindTheStory(e.target.value)}
                  className="w-full text-lg leading-relaxed border border-neutral-200 rounded-xl p-6 focus:border-black focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Entry Content
                </label>
                <textarea 
                  rows={15}
                  placeholder="Write your structural thoughts here..."
                  value={notebookContent}
                  onChange={(e) => setNotebookContent(e.target.value)}
                  className="w-full text-lg leading-relaxed border border-neutral-200 rounded-xl p-6 focus:border-black focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-pink-500 mb-3 flex items-center gap-2">
                  <FileText size={16} /> Discussion Prompt
                </label>
                <textarea 
                  rows={2}
                  placeholder="One thought-provoking question to spark debate..."
                  value={discussionPrompt}
                  onChange={(e) => setDiscussionPrompt(e.target.value)}
                  className="w-full text-2xl font-black border-b border-neutral-200 py-2 focus:border-black focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
