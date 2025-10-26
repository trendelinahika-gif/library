'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [emailNotif, setEmailNotif] = useState(true)

  useEffect(() => {
    const s = localStorage.getItem('emailNotif')
    setEmailNotif(s ? JSON.parse(s) : true)
  }, [])

  function toggleEmail() {
    const next = !emailNotif
    setEmailNotif(next)
    localStorage.setItem('emailNotif', JSON.stringify(next))
    toast.success(next ? 'Email notifications enabled' : 'Email notifications disabled')
  }

  function clearLocalData() {
    localStorage.removeItem('favorites')
    localStorage.removeItem('reservedIds')
    localStorage.removeItem('rsvps')
    localStorage.removeItem('notifications')
    toast.success('Local data cleared')
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-gray-500">Switch between light and dark</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTheme('light')} className={`px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Light</button>
                <button onClick={() => setTheme('dark')} className={`px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Dark</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive event and reservation emails</p>
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={emailNotif} onChange={toggleEmail} className="w-4 h-4" />
                <span className="text-sm">Enabled</span>
              </label>
            </div>

            <div className="p-4 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Local Data</p>
                <p className="text-sm text-gray-500">Clear saved favorites, reservations and notifications</p>
              </div>
              <button onClick={clearLocalData} className="px-4 py-2 bg-red-600 text-white rounded-lg">Clear</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
