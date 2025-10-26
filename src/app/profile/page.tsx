'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Save, Edit } from 'lucide-react'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')

  useEffect(() => {
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
    setEmail(user?.email || '')
  }, [user])

  function handleSave() {
    const updated = { ...user, firstName, lastName, email }
    login(updated, localStorage.getItem('token') || 'demo-token')
    toast.success('Profile updated')
    setEditing(false)
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100">
              <Image src="/logo.png" alt="avatar" width={112} height={112} className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{firstName} {lastName}</h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
            <div>
              <button onClick={() => setEditing(e => !e)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                <Edit className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>

          {editing && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-1 p-3 border rounded-lg" />
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-1 p-3 border rounded-lg" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-1 p-3 border rounded-lg" />
              <div className="col-span-3 flex justify-end mt-2">
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-600">This is your profile dashboard. You can manage your information, view your reserved books, events and settings from here.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
