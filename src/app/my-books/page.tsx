'use client'

import { useEffect, useState } from 'react'
import { MOCK_BOOKS } from '@/lib/mockBooks'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function MyBooksPage() {
  const [reserved, setReserved] = useState<string[]>([])

  useEffect(() => {
    const rs = localStorage.getItem('reservedIds')
    setReserved(rs ? JSON.parse(rs) : [])
  }, [])

  function handleReturn(id: string) {
    const next = reserved.filter(r => r !== id)
    setReserved(next)
    localStorage.setItem('reservedIds', JSON.stringify(next))
    toast.success('Book returned')
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Books</h1>

          {reserved.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">You have no reserved books. Browse the <Link href="/catalog" className="text-blue-600">catalog</Link>.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reserved.map(id => {
                const book = MOCK_BOOKS.find(b => b.id === id)
                if (!book) return null
                return (
                  <div key={id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col">
                    <div>
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <p className="text-sm text-gray-500">by {book.author} • {book.year}</p>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{book.description}</p>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button onClick={() => handleReturn(id)} className="px-3 py-2 bg-red-600 text-white rounded-lg">Return</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
