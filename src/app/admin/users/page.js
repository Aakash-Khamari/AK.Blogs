'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Trash2, Loader2, Users, Shield, ShieldAlert, Check } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
      setUsers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const confirmMessage = newRole === 'admin' 
      ? `Are you sure you want to promote ${user.display_name} to Admin? They will have full access to the dashboard.`
      : `Are you sure you want to demote ${user.display_name} to User? They will lose access to the dashboard.`
    
    if (!confirm(confirmMessage)) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id)
      
      if (error) throw error

      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error(err)
      alert('Error updating user role')
    }
  }

  const handleDelete = async (user) => {
    if (!confirm(`CRITICAL ACTION: Are you sure you want to permanently delete the account for ${user.display_name}? This cannot be undone.`)) return
    
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user')
      }

      setUsers(users.filter(u => u.id !== user.id))
      alert('User deleted successfully.')
    } catch (err) {
      console.error(err)
      alert(`Error deleting user: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex flex-col transition-colors duration-500">
      {/* Top Bar */}
      <header className="bg-white dark:bg-[#111] border-b border-neutral-200 dark:border-neutral-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-neutral-500 hover:text-black dark:hover:text-white transition flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-800" />
          <span className="font-black text-[#111] dark:text-white text-lg tracking-tighter flex items-center gap-2">
            <Users size={18} /> User Management
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#111] dark:text-white mb-2">User Management</h1>
          <p className="text-neutral-500 font-medium">Manage permissions and remove accounts.</p>
        </div>

        <div className="bg-white dark:bg-[#111] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20 text-neutral-400">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-neutral-500 font-medium">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-500">Name</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-500">Email</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-500">Role</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-500">Joined</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition">
                      <td className="p-4 font-bold text-[#111] dark:text-white">{user.display_name || 'Anonymous'}</td>
                      <td className="p-4 text-neutral-500 text-sm">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center w-max gap-1 ${
                          user.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}>
                          {user.role === 'admin' && <Shield size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleRole(user)}
                            title={user.role === 'admin' ? "Revoke Admin" : "Make Admin"}
                            className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(user)}
                            title="Delete User"
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
