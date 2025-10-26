'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const MOCK_EVENTS = [
  { id: 'e1', title: 'Reading Hour with Authors', date: '2025-11-02', location: 'Main Hall' },
  { id: 'e2', title: 'Archive Workshop', date: '2025-11-05', location: 'Workshop Room' }
]

export default function MyEventsPage() {
  const [rsvps, setRsvps] = useState<string[]>([])

  useEffect(() => {
    const s = localStorage.getItem('rsvps')
    setRsvps(s ? JSON.parse(s) : [])
  }, [])

  function toggleRsvp(id: string) {
    const next = rsvps.includes(id) ? rsvps.filter(r => r !== id) : [...rsvps, id]
    setRsvps(next)
    localStorage.setItem('rsvps', JSON.stringify(next))
    toast.success(rsvps.includes(id) ? 'RSVP cancelled' : 'RSVP confirmed')
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Events</h1>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_EVENTS.map(ev => (
              <div key={ev.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{ev.title}</h3>
                  <p className="text-sm text-gray-500">{ev.date} • {ev.location}</p>
                </div>
                <div>
                  <button onClick={() => toggleRsvp(ev.id)} className={`px-4 py-2 rounded-lg ${rsvps.includes(ev.id) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {rsvps.includes(ev.id) ? 'Going' : 'RSVP'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-gray-600">Check your events and RSVP status. You can cancel an RSVP anytime.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
