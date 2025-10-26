'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import toast from 'react-hot-toast'

type Note = { id: string; title: string; body: string; read?: boolean }

const SAMPLE: Note[] = [
  { id: 'n1', title: 'Reservation ready', body: 'Your reserved book "History of Kosovo" is ready for pickup.' },
  { id: 'n2', title: 'Event reminder', body: 'Reading Hour starts tomorrow at 18:00.' }
]

export default function NotificationsPage() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('notifications')
    setNotes(raw ? JSON.parse(raw) : SAMPLE)
  }, [])

  function dismiss(id: string) {
    const next = notes.filter(n => n.id !== id)
    setNotes(next)
    localStorage.setItem('notifications', JSON.stringify(next))
    toast('Notification dismissed')
  }

  function markAllRead() {
    const next = notes.map(n => ({ ...n, read: true }))
    setNotes(next)
    localStorage.setItem('notifications', JSON.stringify(next))
    toast.success('All notifications marked read')
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div className="flex items-center gap-2">
              <button onClick={markAllRead} className="px-3 py-2 bg-blue-600 text-white rounded-lg">Mark all read</button>
            </div>
          </div>

          <div className="space-y-3">
            {notes.length === 0 && (<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">No notifications</div>)}
            {notes.map(n => (
              <div key={n.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1"><Bell className="w-4 h-4" /><strong>{n.title}</strong></div>
                  <p className="text-sm text-gray-600">{n.body}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => dismiss(n.id)} className="p-2 rounded-md text-gray-500 hover:bg-gray-100"> <X className="w-4 h-4"/> </button>
                  <span className="text-xs text-gray-400">{n.read ? 'Read' : 'New'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
