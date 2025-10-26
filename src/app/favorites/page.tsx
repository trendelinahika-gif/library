'use client'

import { useEffect, useState } from 'react'
import { MOCK_BOOKS } from '@/lib/mockBooks'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const raw = localStorage.getItem('favorites')
    setFavorites(raw ? JSON.parse(raw) : [])
  }, [])

  function remove(id: string) {
    const next = favorites.filter(f => f !== id)
    setFavorites(next)
    localStorage.setItem('favorites', JSON.stringify(next))
    toast('Removed from favorites')
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Favorites</h1>

          {favorites.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">You have no favorites yet. Browse the <Link href="/catalog" className="text-blue-600">catalog</Link>.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(id => {
                const book = MOCK_BOOKS.find(b => b.id === id)
                if (!book) return null
                return (
                  <div key={id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col">
                    <div>
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <p className="text-sm text-gray-500">by {book.author} • {book.year}</p>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{book.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Link href={`/catalog`} className="text-sm text-blue-600">View in catalog</Link>
                      <button onClick={() => remove(id)} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm">Remove</button>
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
